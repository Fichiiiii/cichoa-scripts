import { system, world } from '@minecraft/server'

function getChunk(x, z) {
    return {x: Math.ceil((x + 1) / 16) - 1, y: -64, z: Math.ceil((z + 1) / 16) - 1 }
}

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
    const player = eventData.player

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    const data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (!data) return

    if (data.getTags().find(tag => tag.startsWith("playersCanBreakBlocks:")) == "playersCanBreakBlocks:true") return

    const tags = data.getTags()
    const owner = tags.find(tag => tag.startsWith("owner:")).split(":")[1]
    const whitelist = tags.find(tag => tag.startsWith("whitelist:")).split(":")[1].replaceAll(" ", "").split(',')

    if (owner == player.name || whitelist.includes(player.name.replaceAll(" ", ""))) return
    
    eventData.cancel = true

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to break blocks on this plot")
    })
})

/* world.beforeEvents.playerPlaceBlock.subscribe(eventData => {
    const player = eventData.player

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    const data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (!data) return

    if (data.getTags().find(tag => tag.startsWith("playersCanPlaceBlocks:")) == "playersCanPlaceBlocks:true") return

    const tags = data.getTags()
    const owner = tags.find(tag => tag.startsWith("owner:"))?.split(":")[1]

    if (owner == player.name) return
    
    eventData.cancel = true

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to place blocks on this plot")
    })
})
 */

world.beforeEvents.itemUseOn.subscribe(eventData => {
    const player = eventData.source

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    const data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (!data) return

    if (data.getTags().find(tag => tag.startsWith("playersCanPlaceBlocks:")) == "playersCanPlaceBlocks:true") return

    const tags = data.getTags()
    const owner = tags.find(tag => tag.startsWith("owner:"))?.split(":")[1]
    const whitelist = tags.find(tag => tag.startsWith("whitelist:")).split(":")[1].replaceAll(" ", "").split(',')

    if (owner == player.name || whitelist.includes(player.name.replaceAll(" ", ""))) return
    
    eventData.cancel = true

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to use items or place blocks on this plot")
    })
})

/* world.beforeEvents.playerInteractWithBlock.subscribe(eventData => {
    const player = eventData.player

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    const data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (!data) return

    const tags = data.getTags()
    const owner = tags.find(tag => tag.startsWith("owner:"))?.split(":")[1]

    if (owner == player.name) return
    
    eventData.cancel = true

    system.run(() => {
        player.onScreenDisplay.setActionBar("§cYou're not allowed to interact with blocks on this plot")
    })
}) */

world.beforeEvents.pistonActivate.subscribe(eventData => {
    const blocks = eventData.piston.getAttachedBlocks()

    let chunkStart = []

    blocks.forEach(block => {
        const chunk = getChunk(block.x, block.z)
        chunkStart.push(JSON.stringify(chunk))
    })

    let chunks = [...new Set(chunkStart)]

    for (let i = 0; i < chunks.length; i++) {
        chunks[i] = JSON.parse(chunks[i])
    }

    chunks.forEach(chunk => {
        const data = eventData.dimension.getEntitiesAtBlockLocation({x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}).find(entity => entity.typeId == "cs:data")

        if (!data) return

        if (data.getTags().find(tag => tag.startsWith("pistonsMoveBlocks:")) == "pistonsMoveBlocks:false") eventData.cancel = true
    })
})