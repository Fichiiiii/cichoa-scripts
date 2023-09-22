import { DynamicPropertiesDefinition, world } from '@minecraft/server'

world.afterEvents.worldInitialize.subscribe(eventData => {
    let db = new DynamicPropertiesDefinition();

    db.defineString("chunks", 131064)
    db.defineNumber("border")

    eventData.propertyRegistry.registerWorldDynamicProperties(db)
})