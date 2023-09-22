import { system, world} from '@minecraft/server'

system.afterEvents.scriptEventReceive.subscribe(eventData => {

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    if (eventData.id == 'cs:immortalizer') {

        const container = player.getComponent("inventory").container
        const heldItem = container.getItem(player.selectedSlot)

        const validItems = ['cs:op_sword', 'cs:soviet_axe']

        if (heldItem.keepOnDeath) {
            player.sendMessage('§cThis item is already immortal')
            return
        }

        if (!validItems.includes(heldItem.typeId)) {
            player.sendMessage('§cThis item cannot be immortalized')
            return
        }

        let immortalizerSlot = 0
        for (let i = 0; i < 36; i++) {
            const item = container.getItem(i)

            if (item && item.typeId == 'minecraft:paper' && item.getLore() == 'Use this item to immortalize an item') {
                immortalizerSlot = i
                break
            }
        }

        const immortalizer = container.getItem(immortalizerSlot)

        if (immortalizer.typeId != 'minecraft:paper' && immortalizer.getLore() != 'Use this item to immortalize an item') {
            player.sendMessage('§cYou don\'t have an immortalizer in your inventory')
            return
        }

        heldItem.keepOnDeath = true

        container.setItem(player.selectedSlot, heldItem)

        player.sendMessage('§aYour item is now immortal')

        if (immortalizer.amount == 1) {
            container.setItem(immortalizerSlot, null)
        }
        else {
            immortalizer.amount -= 1
            container.setItem(immortalizerSlot, immortalizer)
        }
    }
})