
import { ZaraCollectorService } from './src/zara/zara.collector.service';
import { Logger } from '@nestjs/common';

async function run() {
    const collector = new ZaraCollectorService();
    console.log('Starting standalone collection...');
    await collector.collectAndSave();
    console.log('Done.');
}

run();
