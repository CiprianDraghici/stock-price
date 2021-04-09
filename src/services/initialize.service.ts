export class InitializeService {
    private static instance: InitializeService;

    public static getInstance(): InitializeService {
        if (!InitializeService.instance) {
            InitializeService.instance = new InitializeService();
        }

        return InitializeService.instance;
    }

    public async init() {
        sessionStorage.accessToken = "c1o47ri37fkqrr9s87mg";
    }
}