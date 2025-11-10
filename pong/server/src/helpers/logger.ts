const logger = (req: Request) => {
    const url = new URL(req.url);

    console.log(
        `[${new Date().toISOString()}] ${req.method} ${url.pathname}`
    );
}

export default logger;