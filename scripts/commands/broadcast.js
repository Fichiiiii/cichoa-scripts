import { world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if ((eventData.message.startsWith('.broadcast') || eventData.message.startsWith('.bc')) && player.hasTag('staff')) {

        eventData.cancel = true

        world.sendMessage(` <Server Broadcast> ${eventData.message.split(' ').slice(1).join(' ')}`)

    }
})