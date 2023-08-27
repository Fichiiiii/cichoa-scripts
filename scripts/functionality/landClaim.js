import { system, world } from '@minecraft/server'
import { ActionFormData, ModalFormData } from '@minecraft/server-ui'

world.beforeEvents.itemUse.subscribe(eventData => {
    if (eventData.itemStack.typeId != "minecraft:stick") return

    let dbChunks = world.getDynamicProperty("chunks") || '{"chunks": []}'
    dbChunks = JSON.parse(dbChunks)

    const player = eventData.source

    function getChunk(x, z) {
        return {x: Math.ceil((x + 1) / 16) - 1, y: 0, z: Math.ceil((z + 1) / 16) - 1 }
    }

    const chunkLocation = getChunk(Math.floor(player.location.x), Math.floor(player.location.z))

    function getClaim(location) {

        let isClaimed = false
        let owner = null

        dbChunks.chunks.forEach(chunk => {
            if (location.x == chunk.x && location.z == chunk.z) {
                isClaimed = true
                owner = chunk.owner
            }
        })

        return { isClaimed, owner }
    }

    const { isClaimed, owner } = getClaim(chunkLocation)

    const bodyText = 
        `\
§rChunk: §c${chunkLocation.x} §9${chunkLocation.z}
§rClaimed: §${isClaimed ? "a" : "c"}${isClaimed ? "True" : "False"}
§rOwner: ${owner ? owner : "None"}
        `
    
    system.run(() => {
        const form = new ActionFormData()
            .title("Chunk Claiming")
            .body(bodyText)
                
        if (!isClaimed) form.button("Claim")
        if (owner == player.name) form.button("Edit")
        form.button("Close")
    
        form.show(player).then(r => {
            if (r.canceled) return
    
            if (r.selection == 0 && !isClaimed) {
                const scoreboard = world.scoreboard.getObjective('chunkTokens')
                const tokens = scoreboard.getScore(player.scoreboardIdentity)

                if (tokens >= 1) {
                    dbChunks.chunks.push({"x": chunkLocation.x, "z": chunkLocation.z, "owner": player.name})
                    world.setDynamicProperty("chunks", JSON.stringify(dbChunks))
                    scoreboard.setScore(player.scoreboardIdentity, tokens - 1)
                    player.sendMessage(`§aYou claimed the Chunk at ${chunkLocation.x} ${chunkLocation.z}`)
                } else {
                    player.sendMessage(`§cYou don't have enough tokens to claim this chunk`)
                }
            }
            if (r.selection == 0 && owner == player.name) {
                new ModalFormData()
                    .title("Edit Chunk Settings")
                    .textField(`§rChunk: §c${chunkLocation.x} §9${chunkLocation.z}\n\n§rAdd players excluded from your set rules divided by a comma`, `Fichi1657, Fincha4`, dbChunks.chunks.find(chunk => chunk.x == chunkLocation.x && chunk.z == chunkLocation.z).whitelist ?? "")
                    .toggle("§cAllow players to break blocks", dbChunks.chunks.find(chunk => chunk.x == chunkLocation.x && chunk.z == chunkLocation.z).allowBlockBreaking ?? false)
                    .toggle("§cAllow players to place blocks", dbChunks.chunks.find(chunk => chunk.x == chunkLocation.x && chunk.z == chunkLocation.z).allowBlockPlacing ?? false)
                    .toggle("Allow players to use items", dbChunks.chunks.find(chunk => chunk.x == chunkLocation.x && chunk.z == chunkLocation.z).allowItemUse ?? false)
                    .show(player).then(r => {
                        if (r.canceled) return

                        const entry = dbChunks.chunks.find(chunk => chunk.x == chunkLocation.x && chunk.z == chunkLocation.z)
                            entry.whitelist = r.formValues[0]
                            entry.allowBlockBreaking = r.formValues[1]
                            entry.allowBlockPlacing = r.formValues[2]
                            entry.allowItemUse = r.formValues[3]

                        world.setDynamicProperty("chunks", JSON.stringify(dbChunks))
                        player.sendMessage(`§aUpdated your preferences for chunk ${chunkLocation.x} ${chunkLocation.z}`)
                    })
            }
        })
    })
})
