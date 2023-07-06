import { world } from '@minecraft/server'

world.afterEvents.itemUse.subscribe(eventData => {

    const player = eventData.player

    const lore = eventData.itemStack.getLore()[0]

    if (lore == 'Can be traded for an immortal item') {

        let item = lore.split(' ')

        if (item[5] == 'Elytra') {
            item = item[5]
        }
        else {
            item = `${item[5]}_${item[6]}`
        }

        if (item == 'Elytra') {
            player.sendMessage('§cA strong force stops you from redeeming this token right now')
            return
        }

        player.runCommandAsync(`give @s ${item} 1 0 {"keep_on_death":{}}`)
            
        if (item == 'Diamond_Leggings' || item == 'Diamond_Boots') {
            player.sendMessage(`§dYou have been given a pair of immortal ${item.replace('_', ' ')}`)
        }
        else if (item == 'Elytra') {
            player.sendMessage(`§dYou have been given an immortal ${item}`)
        }
        else {
            player.sendMessage(`§dYou have been given an immortal ${item.replace('_', ' ')}`)
        }
        
        const inventory = player.getComponent('inventory').container

        const token = inventory.getItem(player.selectedSlot)

        if (token.amount == 1) {
            inventory.setItem(player.selectedSlot, null)
        } else {
            token.amount -= 1
            inventory.setItem(player.selectedSlot, token)
        }
    }
})