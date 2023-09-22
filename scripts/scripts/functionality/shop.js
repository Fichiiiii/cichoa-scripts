// This snippet is broken as of 1.20

import { system, world, ItemStack, ItemTypes } from '@minecraft/server';
import { ModalFormData } from '@minecraft/server-ui'

// Shop System
// Create a shop
world.beforeEvents.itemUseOn.subscribe(eventData => {
    const block = world.getDimension("overworld").getBlock(eventData.source.getBlockFromViewDirection().location);
    const player = eventData.source;
    if (block.typeId === "minecraft:chest" && eventData.itemStack.typeId === "minecraft:gold_nugget" && eventData.itemStack.getLore()[0] === "§r§5Create a shop by using this item on a chest") {
        let itemCheck = block.getComponent("inventory").container
        eventData.cancel = true;
        if (itemCheck.getItem(0) && itemCheck.getItem(0).getLore()[0] === "§r§5Remove this item to remove the shop") {
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cYou can't overwrite another shop"}]}`)
        }
        else {
            if (itemCheck.emptySlotsCount === itemCheck.size) {
                let item = eventData.source.getComponent("inventory").container.getItem(eventData.source.selectedSlot)
                system.run(() => {
                    if (item.amount > 1) {
                        item.amount -= 1
                    } else {
                        item = null
                    }
                })
                
                system.run(() => {
                    player.getComponent("inventory").container.setItem(player.selectedSlot, item)
                    let shopDestroyer = new ItemStack(ItemTypes.get("minecraft:deny"), 1)
                    shopDestroyer.nameTag = `§r§f${player.name}'s Shop`
                    shopDestroyer.setLore(["§r§5Remove this item to remove the shop"])
                    block.getComponent("inventory").container.setItem(0, shopDestroyer)
                    let pricing = new ItemStack(ItemTypes.get("minecraft:paper"))
                    pricing.nameTag = `16|minecraft:diamond|1||1`
                    pricing.setLore(["§r§7Use this item to configure the price tag"])
                    for (let i = 1; i < 9; i++) {
                        block.getComponent("inventory").container.setItem(18 + i, pricing)
                    }
                })
            }
            else {
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cYou can't create a shop using a filled chest"}]}`)
            }
        }
    }
});

// Use a shop
world.beforeEvents.itemUseOn.subscribe(eventData => {
    const block = eventData.block
    let player = eventData.source
    const inv = player.getComponent('inventory')?.container;
    if (block.type.id === "minecraft:chest") {	
        let itemCheck = block.getComponent("inventory").container
        if (!itemCheck.getItem(0)) return;
        if (itemCheck.getItem(0).getLore()[0] === "§r§5Remove this item to remove the shop" && itemCheck.getItem(0).nameTag.split("'")[0] != `§r§f${eventData.source.name}` && eventData.itemStack.getLore() != "§r§5Use this item to look into other player's shops§5") {
            const offers = [];
            for (let i = 1; i < 9; i++) {
                if (itemCheck.getItem(i)) {
                    let price = []
                    price.push(itemCheck.getItem(i + 18).nameTag.split("|")[0])
                    price.push(itemCheck.getItem(i + 18).nameTag.split("|")[1])
                    price.push(itemCheck.getItem(i + 18).nameTag.split("|")[2])
                    offers.push(price[0] + "x " + itemCheck.getItem(i).typeId.split(":")[1].replaceAll("_", " ") + " " + itemCheck.getItem(i).data + " for " + price[2] + "x " + price[1].replaceAll("_", " ") + " (" + itemCheck.getItem(i).amount + " in Stock)")
                }
                else {
                    offers.push("Empty Slot")
                }
            }
            let shopForm = new ModalFormData()
            shopForm.title(`${itemCheck.getItem(0).nameTag.split("'")[0]}'s Shop`);
            shopForm.dropdown("Offers", offers);
            shopForm.slider("Amount", 1, 64, 1);
            shopForm.textField("Promo Code (leave blank if none)", "")
            eventData.cancel = true;
            shopForm.show(eventData.source).then(r => {
                if (!r.isCanceled) {
                    // Check for the promo code
                    let discount = 0
                    if (r.formValues[2] != '' && itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[3]) {
                        if (r.formValues[2] != itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[3]) {
                            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThe entered promo code is incorrect"}]}`)
                        } else {
                            if (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[4] > itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2]) {
                                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThere was an error with this promo code on the shop's side"}]}`)
                            } else {
                                discount = itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[4]
                            }
                        }
                    }
                    // Check if item exists
                    if (!itemCheck.getItem(r.formValues[0] + 1)) {
                        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThis item could not be bought as the shop doesn't have it in stock"}]}`)
                    }
                    else {
                        // Check if the entered amount is in stock
                        if (r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[0]) > itemCheck.getItem(r.formValues[0] + 1).amount) {
                            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThis item could not be bought as the shop doesn't have the entered amount in stock"}]}`)
                        }
                        else {
                            let payItems = 0;
                            for (let i = 0; i < inv.size; i++) {
                                const item = inv.getItem(i);
                                if (!item) {
                                    continue;
                                }
                                if (item.typeId == `${itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1]}`) {
                                    payItems += item.amount;
                                }
                            }
                            // Check if the player has enough items to buy the item
                            if (payItems < r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2] - discount)) {
                                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cYou don't have enough ${itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1].replaceAll("_", " ").split(':')[1]}(s) to buy this item"}]}`)
                            }
                            else {
                                // Check if the player has enough space in their inventory
                                if (inv.emptySlotsCount < 1) {
                                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cYou don't have enough space in your inventory to buy this item"}]}`)
                                }
                                else {
                                    // Check if the shop can store the payment
                                    if (itemCheck.getItem(r.formValues[0] + 10) && (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1] != itemCheck.getItem(r.formValues[0] + 10).typeId)) {
                                        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThe shop doesn't have enough space to store the payment"}]}`)
                                    }
                                    else {
                                        if (itemCheck.getItem(r.formValues[0] + 10) && ((r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2] - discount)) + itemCheck.getItem(r.formValues[0] + 10).amount > 64)) {
                                            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§cThe shop doesn't have enough space to store the payment"}]}`)
                                        }
                                        else {
                                            // Remove payment from player
                                            player.runCommandAsync(`clear @s ${itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1]} 0 ${r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2] - discount)}`)
                                            // Give items to player
                                            let chestItem = itemCheck.getItem(r.formValues[0] + 1)
                                            chestItem.amount = r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[0])
                                            const item = chestItem.clone()
                                            inv.addItem(chestItem)
                                            // Remove items from chest
                                            chestItem = itemCheck.getItem(r.formValues[0] + 1)
                                            if (chestItem.amount -  r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[0]) > 0) {
                                                chestItem.amount -= r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[0])
                                            } else {
                                                chestItem = null
                                            }
                                            itemCheck.setItem(r.formValues[0] + 1, chestItem)
                                            // Give payment to shop
                                            if (itemCheck.getItem(r.formValues[0] + 10)) {
                                                let payment = new ItemStack(Items.get(`${itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1]}`), (r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2] - discount)) + itemCheck.getItem(r.formValues[0] + 10).amount)
                                                itemCheck.setItem(r.formValues[0] + 10, payment)
                                            }
                                            else {
                                                let payment = new ItemStack(Items.get(`${itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[1]}`), (r.formValues[1] * (itemCheck.getItem(r.formValues[0] + 19).nameTag.split("|")[2] - discount)))
                                                itemCheck.setItem(r.formValues[0] + 10, payment)
                                            }
                                            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§aYou bought ${item.amount} ${item.typeId.split(":")[1].replaceAll("_", " ")}(s)"}]}`)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
        }
    }
})

// Make the shop unmovable by pistons
world.beforeEvents.pistonActivate.subscribe(eventData => {
    eventData.piston.getAttachedBlocks().forEach(block => {
        if (world.getDimension("overworld").getBlock(block).typeId == "minecraft:chest") {
            if (!world.getDimension("overworld").getBlock(block).getComponent("inventory").container.getItem(0)) return;
            if (world.getDimension("overworld").getBlock(block).getComponent("inventory").container.getItem(0).getLore()[0] === "§r§5Remove this item to remove the shop") {
                eventData.cancel = true
            }
        }
    });

})

// Make a ui for the custom pricing
world.afterEvents.itemUse.subscribe(eventData => {
    const player = eventData.source
    const item = eventData.itemStack
    if (item.getLore() == '§r§7Use this item to configure the price tag') {
        const pricingForm = new ModalFormData()
        pricingForm.title("Set a price")
        pricingForm.slider("Amount of items to sell", 1, 64, 1, parseInt(item.nameTag.split("|")[0]))
        pricingForm.textField("Item id of the payment (with namespace)", "minecraft:diamond", item.nameTag.split("|")[1])
        pricingForm.slider("Amount of the payment item", 1, 64, 1, parseInt(item.nameTag.split("|")[2]))
        pricingForm.textField("Add a promo code (leave empty to disable promo codes)", "Cichoa2023", item.nameTag.split("|")[3] || "")
        pricingForm.slider("Discount", 0, 64, 1, parseInt(item.nameTag.split("|")[4]) || 1)
        pricingForm.show(player).then(r => {
            item.nameTag = `${r.formValues[0]}|${r.formValues[1]}|${r.formValues[2]}|${r.formValues[3]}|${r.formValues[4]}`
            player.getComponent('inventory').container.setItem(player.selectedSlot, item)
        })
    }
})