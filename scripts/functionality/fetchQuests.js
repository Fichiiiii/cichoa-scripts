import { system, world } from '@minecraft/server'

system.events.scriptEventReceive.subscribe(eventData => {

    const player = world.getAllPlayers().find(player => player.name == eventData.message)

    if (eventData.id == 'cs:quaza') {

        let currentQuest = false

        player.getTags().forEach(tag => {

            if (tag.startsWith('quest:')) {

                currentQuest = tag
                return
            }
        })

        if (!currentQuest) {

            const items = ['stick', 'piston', 'vine', 'activator_rail', 'baked_potato', 'cartography_table', 'glowstone_dust', 'ender_eye', 'flint', 'hay_block', 'iron_ingot', 'jungle_log', 'book', 'lever', 'magma', 'netherbrick', 'oak_fence', 'quartz', 'redstone', 'seagrass', 'tnt', 'beetroot']

            const item = items[Math.floor(Math.random() * items.length)]
            const quantity = Math.floor(Math.random() * 7) + 1

            player.addTag(`quest:${item}:${quantity}`)

            player.sendMessage(`Bring me ${quantity}x ${item.replace('_', ' ')}`)

        } 
        else {
            const heldItem = player.getComponent('inventory').container.getItem(player.selectedSlot) ?? false

            const questData = currentQuest.split(':')

            if (!heldItem) {

                player.sendMessage(`Please bring me ${questData[2]}x ${questData[1].replace('_', ' ')}`)

            }
            else {
                if (heldItem.typeId == `minecraft:${questData[1]}` && heldItem.amount == questData[2]) {

                    const rewards = ['cs:present|0', 'minecraft:diamond|2', 'cs:marijuana|1', 'cs:villager_cart_spawn_egg|0', 'minecraft:experience_bottle|4', 'minecraft:dirt|31', 'minecraft:crying_obsidian|4', 'minecraft:poisonous_potato|5', 'minecraft:empty_map|0', 'minecraft:arrow|31']
                    
                    const reward = Math.floor(Math.random() * rewards.length)
    
                    system.run(() => {
                        player.runCommandAsync(`replaceitem entity @s slot.weapon.mainhand 0 ${rewards[reward].split('|')[0]} ${rewards[reward].split('|')[1]}`)
                    })
                    
                    player.removeTag(currentQuest)

                    player.sendMessage(`§dYou have completed the quest!`)

                }
                else {

                    player.sendMessage(`Please bring me ${questData[2]}x ${questData[1].replace('_', ' ')}`)
                    
                }
            }
        }
    }
})