const { Cluster } = require('../dist');

(async () => {
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    // Define a task (extracting document.title in this case)
    await cluster.task(async ({ page, data: url }) => {
        await page.goto(url);

        const path = url.replace(/[^a-zA-Z]/g, '_') + '.png';
        await page.screenshot({ path });
        console.log(`Screenshot of ${url} saved: ${path}`);
    });

    // Add some pages to queue
    await cluster.queue('https://www.google.com');
    await cluster.queue('https://www.wikipedia.org');
    await cluster.queue('https://github.com/');

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();