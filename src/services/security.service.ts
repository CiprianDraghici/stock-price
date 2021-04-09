export class SecurityService {
    public getToken() {
        let token = sessionStorage.accessToken;
        return token || null;
    }
}