import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if (eventData.message.startsWith('.map')) {

        eventData.cancel = true

        player.runCommandAsync(`execute in overworld run tp @s 9983 63 9983`)

    }
})