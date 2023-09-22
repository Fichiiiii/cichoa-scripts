import { system, world } from '@minecraft/server'

function isWhitelisted(chunk, player) {
    let whitelist = []
    whitelist.push(chunk?.owner)

    const whitelistedPlayers = chunk?.whitelist?.replaceAll(" ", "").split(",") ?? []
    whitelist.push(...whitelistedPlayers)

    const isWhitelisted = whitelist.includes(player.name.replaceAll(" ", ""))

    return isWhitelisted
}

function getChunkData(pos) {
    let dbChunks = world.getDynamicProperty("chunks") || '{"chunks": []}'
    dbChunks = JSON.parse(dbChunks)

    const location = {x: Math.ceil((pos.x + 1) / 16) - 1, z: Math.ceil((pos.z + 1) / 16) - 1 }

    const chunk = dbChunks.chunks.find(chunk => chunk.x == location.x && chunk.z == location.z)

    return chunk
}

world.afterEvents.blockBreak.subscribe(eventData => {
    const chunk = getChunkData(eventData.block.location)

    if (!chunk) return

    if (chunk.allowBlockBreaking) return

    const player = eventData.player

    if (isWhitelisted(chunk, player)) return

    player.applyDamage(10, { cause: "entityExplosion", damagingEntity: player.dimension.getEntities({ location: player.location, closest: 1, type: "item" })[0] })

    // eventData.block.setPermutation(eventData.brokenBlockPermutation)

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to break blocks on this plot")
    })
    
})

world.beforeEvents.itemUseOn.subscribe(eventData => {
    const chunk = getChunkData(eventData.block.location)

    if (!chunk) return

    if (chunk.allowItemUse) return

    const player = eventData.source

    if (isWhitelisted(chunk, player)) return
    if (player.hasTag('staff')) return

    eventData.cancel = true

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to use items on this plot")
    })
})

