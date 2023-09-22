import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if (eventData.message.startsWith('.run') && player.hasTag('staff')) {

        eventData.cancel = true

        const code = eventData.message.split('.run ')[1]

        system.run(() => {
            eval(code)
        })

    }
})