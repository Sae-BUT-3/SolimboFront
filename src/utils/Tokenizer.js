import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

export default class Tokenizer {
    constructor() {
        this.state = {
            baseUrl: Config.API_URL,
        };
    }

    clearToken = async () => {
        await AsyncStorage.multiRemove(['tokenObj', 'userObj']);
    };

    setToken = async token => {
        await AsyncStorage.setItem('tokenObj', JSON.stringify(token));
    };

    getValidToken = async () => {
        const token = JSON.parse(await AsyncStorage.getItem('tokenObj'));

        // Check if we have a valid token
        if (token) {
        // Grab the token expiry date
        const {expiresIn} = token;
        const expireDate = Date.parse(expiresIn);
        const currentDate = moment().add(10, 'days');

        if (currentDate >= expireDate) {
            let newToken = await this.newToken();
            return newToken.accessToken;
        } else {
            return token.accessToken;
        }
        } else {
        return null;
        }
    };

    newToken = async () => {
        const token = JSON.parse(await AsyncStorage.getItem('tokenObj'));
        const user =
        JSON.parse(await AsyncStorage.getItem('userObj')) ||
        JSON.parse(await AsyncStorage.getItem('userObjk'));
        const baseUrl = this.state.baseUrl;

        let response = await axios.post(baseUrl + '/auth/refresh-token/', {
        clientId: Config.CLIENT_ID,
        clientSecret: Config.CLIENT_SECRET,
        email: user.email,
        refreshToken: token.refreshToken,
        });

        if (response.status == 200) {
        let {data} = await response;
        this.setToken(data);
        return data;
        } else {
        this.clearToken();
        return null;
        }
    };
}