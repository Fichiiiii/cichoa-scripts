import { world, Vector } from '@minecraft/server'

world.afterEvents.blockBreak.subscribe(eventData => {

    const player = eventData.player
        
    const blockBefore = eventData.brokenBlockPermutation
    const block = eventData.block
    
    const inventory = player.getComponent('inventory').container

    const item = inventory.getItem(player.selectedSlot)

    const logs = ['minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log', 'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log', 'minecraft:crimson_stem', 'minecraft:warped_stem', 'minecraft:mangrove_log', 'minecraft:cherry_log']

    if (!item) return

    if (item.typeId == 'cs:soviet_axe') {

        if (logs.includes(blockBefore.type.id)) {

            let blocks = [[block.location.x, block.location.y, block.location.z]]
            let blockId = 0

            function checkBlock(location) {

                const checkedBlock = player.dimension.getBlock(location)
                const checkedBlockLocation = [location.x, location.y, location.z]
            
                let inArray = false

                if (checkedBlock.type.id == blockBefore.type.id) {

                    blocks.forEach(block => {

                        if (block[0] == checkedBlockLocation[0] && block[1] == checkedBlockLocation[1] && block[2] == checkedBlockLocation[2]) {

                            inArray = true
                        }
                    })

                    if (!inArray) {

                        blocks.push(checkedBlockLocation)
                    }
                }
            }

            const surroundingBlocks = [
                [0, 0, -1], 
                [1, 0, 0], 
                [0, 0, 1], 
                [-1, 0, 0], 
                [-1, 0, -1], 
                [1, 0, -1], 
                [1, 0, 1], 
                [-1, 0, 1], 
                [0, 1, 0], 
                [0, 1, -1], 
                [1, 1, 0], 
                [0, 1, 1], 
                [-1, 1, 0], 
                [-1, 1, -1], 
                [1, 1, -1], 
                [1, 1, 1], 
                [-1, 1, 1]
            ]
            
            function getBlocks() {

                if (blockId + 1 <= blocks.length) {

                    if (blocks.length > 128) return

                    for (let i = 0; i < surroundingBlocks.length; i++) {

                        let currentBlockLocation = new Vector(blocks[blockId][0] + surroundingBlocks[i][0], blocks[blockId][1] + surroundingBlocks[i][1], blocks[blockId][2] + surroundingBlocks[i][2])

                        checkBlock(currentBlockLocation)
                    }
    
                    blockId += 1

                    getBlocks()
                }
            }

            getBlocks()

            blocks.forEach(block => {
                
                player.runCommand(`setblock ${block[0]} ${block[1]} ${block[2]} air destroy`)
            })
        }
    }
})