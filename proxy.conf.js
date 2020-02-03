const PROXY_CONFIG = [
    {
        context: [
            "/totvs-rest",
            "/totvs-login"
        ],
        target: "http://servidorjboss:8280",
        secure: false,
        changeOrigin: true,
        logLevel: "debug",
        autoRewrite: true
    }, {
        context: [
            "/totvs-rest",
            "/totvs-login",
            "/totvs-menu",
            "/josso",
            "/dts/datasul-rest",
            "/dts/datasul-report"
        ],
        target: "http://gales:8180",
        secure: false,
        changeOrigin: true,
        logLevel: "debug",
        autoRewrite: true,
        // headers: {
        //     Cookie: "JOSSO_SESSIONID=AA6595815344D956C2615243B6449C70; JSESSIONID=EEFAC67B6086F552F30CE3DB70B43A27"
        // }
        headers: {
            Authorization: "Basic c3VwZXI6c3VwZXJAMTIz"
        }
    }
]

module.exports = PROXY_CONFIG;

