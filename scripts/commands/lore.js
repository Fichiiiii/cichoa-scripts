import { system, world } from '@minecraft/server'

world.beforeEvents.chatSend.subscribe(async (eventData) => {

    const player = eventData.sender

    if (eventData.message.startsWith('.lore') && player.hasTag('staff')) {

        eventData.cancel = true

        let container = eventData.sender.getComponent("inventory").container
        let item = container.getItem(eventData.sender.selectedSlot)

        const lore = eventData.message.split(' ').slice(1).join(' ')

        system.run(() => {
            item.setLore([lore])

            container.setItem(player.selectedSlot, item)
        })

    }
})