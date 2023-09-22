import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(eventData => {

    const player = eventData.sender

    if (eventData.message.startsWith('.immortalize') && player.hasTag('staff')) {

        eventData.cancel = true

        const container = eventData.sender.getComponent("inventory").container
        const item = container.getItem(eventData.sender.selectedSlot)

        system.run(() => {
            item.keepOnDeath = true
            container.setItem(player.selectedSlot, item)
        })

    }
})