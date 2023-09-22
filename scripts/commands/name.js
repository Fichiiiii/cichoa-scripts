import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (eventData.message.startsWith('.name') && player.hasTag('staff')) {

        eventData.cancel = true

        const container = eventData.sender.getComponent("inventory").container
        const item = container.getItem(eventData.sender.selectedSlot)
        
        const name = eventData.message.split(' ').slice(1).join(' ')

        system.run(() => {
            item.nameTag = name
            container.setItem(player.selectedSlot, item)
        })

    }
})