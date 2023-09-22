import { BlockPermutation, system, world } from '@minecraft/server'
import { ActionFormData, ModalFormData } from '@minecraft/server-ui'

function getChunk(x, z) {
    return {x: Math.ceil((x + 1) / 16) - 1, y: -64, z: Math.ceil((z + 1) / 16) - 1 }
}

system.afterEvents.scriptEventReceive.subscribe(eventData => {
    if (!eventData.id == 'cs:marker') return

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    const block = eventData.sourceBlock
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    const data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    const owner = data.getTags().find(tag => tag.startsWith("owner:")).split(":")[1]

    const settings = [
        data.getTags().find(tag => tag.startsWith("whitelist:")).split(":")[1],
        data.getTags().find(tag => tag.startsWith("playersCanBreakBlocks:")) == "playersCanBreakBlocks:true",
        data.getTags().find(tag => tag.startsWith("playersCanPlaceBlocks:")) == "playersCanPlaceBlocks:true",
        data.getTags().find(tag => tag.startsWith("pistonsMoveBlocks:")) == "pistonsMoveBlocks:true"
    ]

    if (player.name == owner) {
        system.run(() => {
            new ModalFormData()
                .title("Configure Chunk Settings")
                .textField(`Whitelisted players divided by a comma`, `Fichi1657, Fincha4`, settings[0])
                .toggle("Players can break blocks", settings[1])
                .toggle("Players can use items and place blocks", settings[2])
                .toggle("Pistons can move blocks", settings[3])
                .slider("Texture index", 0, 7, 1, block.permutation.getState("cs:texture"))
                .show(player).then(r => {
                    if (r.canceled) return

                    data.removeTag(data.getTags().find(tag => tag.startsWith("whitelist:"))),
                    data.addTag(`whitelist:${r.formValues[0]}`)

                    data.removeTag(data.getTags().find(tag => tag.startsWith("playersCanBreakBlocks:"))),
                    data.addTag(`playersCanBreakBlocks:${r.formValues[1]}`)

                    data.removeTag(data.getTags().find(tag => tag.startsWith("playersCanPlaceBlocks:"))),
                    data.addTag(`playersCanPlaceBlocks:${r.formValues[2]}`)

                    data.removeTag(data.getTags().find(tag => tag.startsWith("pistonsMoveBlocks:"))),
                    data.addTag(`pistonsMoveBlocks:${r.formValues[3]}`)

                    block.setPermutation(block.permutation.withState("cs:texture", r.formValues[4]))
                })
        })
    }
    else {
        system.run(() => {
            new ActionFormData()
                .title("Claimed Chunk")
                .body(`Owner: §b${owner}§r\nWhitelisted Players: §b${settings[0] || "None"}§r\nplayersCanBreakBlocks: §b${settings[1]}§r\nplayersCanPlaceBlocks: §b${settings[2]}§r\npistonsMoveBlocks: §b${settings[3]}§r`)
                .button({ translate: "gui.close" })
                .show(player)
        })
    }
})

world.beforeEvents.playerPlaceBlock.subscribe(eventData => {
    if (eventData.itemStack.typeId != "cs:marker") return

    const player = eventData.player

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    let data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (data) {
        system.run(() => {
            player.onScreenDisplay.setActionBar("§cThere's already a marker placed in this chunk")
        })

        eventData.cancel = true
        return
    }

    system.run(() => {
        data = player.dimension.spawnEntity("cs:data", chunkStart)
        data.addTag(`owner:${player.name}`)
        data.addTag("whitelist:")
        data.addTag("playersCanBreakBlocks:false")
        data.addTag("playersCanPlaceBlocks:false")
        data.addTag("pistonsMoveBlocks:true")
    })
})

world.beforeEvents.playerBreakBlock.subscribe(eventData => {
    if (eventData.block.type.id != "cs:marker") return

    const player = eventData.player

    const block = eventData.block
    const chunk = getChunk(block.location.x, block.location.z)
    const chunkStart = {x: chunk.x * 16, y: chunk.y, z: chunk.z * 16}

    let data = player.dimension.getEntitiesAtBlockLocation(chunkStart).find(entity => entity.typeId == "cs:data")

    if (!data) return

    const owner = data.getTags().find(tag => tag.startsWith("owner:")).split(":")[1]

    if (owner != player.name) {
        system.run(() => {
            player.onScreenDisplay.setActionBar(`§cYou don't own this marker`)
        })

        eventData.cancel = true
        return
    }

    system.run(() => {
        data.remove()
    })
})