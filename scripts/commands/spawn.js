import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if (eventData.message.startsWith('.spawn')) {

        eventData.cancel = true

        const spawn = world.getDefaultSpawnLocation()

        system.run(() => {
            player.teleport(spawn, { "dimension": world.getDimension("overworld") })
        })
    }
})
