import { world, system, MinecraftBlockTypes, Vector, BlockPermutation} from '@minecraft/server';

world.beforeEvents.chatSend.subscribe(eventData => {

    if (eventData.message.startsWith('.draw')) {
        
        eventData.cancel = true
        
        const chunkX = eventData.message.split(' ')[1]
        const chunkZ = eventData.message.split(' ')[2]
        const args = eventData.message.split(' ')[3].split(',')

        const blocks = ['white_wool', 'light_gray_wool', 'gray_wool', 'black_wool', 'brown_wool', 'red_wool', 'orange_wool', 'yellow_wool', 'lime_wool', 'green_wool', 'cyan_wool', 'light_blue_wool', 'blue_wool', 'purple_wool', 'magenta_wool', 'pink_wool', 'cobblestone', 'planks', 'crimson_planks', 'warped_planks', 'gold_block', 'iron_block', 'emerald_block', 'diamond_block', 'lapis_block', 'redstone_block', 'grass', 'netherrack', 'nether_wart_block', 'warped_wart_block', 'crimson_nylium', 'warped_nylium']
        const woodPermutations = ['oak', 'spruce', 'birch', 'jungle']

        args.forEach(function callback(value, index) {

            function x(num) {
                if (num < 8) {
                    return num
                } else {
                    while (num >= 8) {
                        num -= 8
                    }
                    return num
                }
            }

            const block = world.getDimension('overworld').getBlock(new Vector( (9920 + ( 8 * chunkX)) + x(index), 0, (9920 + ( 8 * chunkZ)) + (index/8)))
            let blockType = blocks[parseInt(value.split(':')[0])]

            system.run(() => {
                block.setType(MinecraftBlockTypes.get(`minecraft:${blockType}`))
            })

            if (parseInt(value.split(':')[0]) == 17) {

                const permutation = BlockPermutation
                    .resolve('planks')
                    .withState('wood_type', `${woodPermutations[parseInt(value.split(':')[1])]}`)

                system.run(() => {
                    block.setPermutation(permutation)
                })
            }
        })
    }
})