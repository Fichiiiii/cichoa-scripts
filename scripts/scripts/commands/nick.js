import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (eventData.message.startsWith('.nick') && player.hasTag('staff')) {
        
        eventData.cancel = true;

        const name = eventData.message.split(' ').slice(1).join(' ')

        system.run(() => {
            player.nameTag = name
        })

    }
})