import { system, world } from '@minecraft/server'

system.afterEvents.scriptEventReceive.subscribe(eventData => {

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    if (eventData.id == 'cs:teleport_player') {

        const tag = eventData.sourceEntity.getTags().find(tag => tag.startsWith("coords:")) ?? "coords:0 0 0"
        const coords = { x: parseInt(tag.split(":")[1].split(" ")[0]), y: parseInt(tag.split(":")[1].split(" ")[1]), z: parseInt(tag.split(":")[1].split(" ")[2]) }

        player.teleport(coords)
    }
})