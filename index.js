require('dotenv').config();
const axios = require('axios');

class CryptoPaymentGateway {
    constructor() {
        this.apiBaseUrl = 'https://api.blockcypher.com/v1/btc/main';
        this.token = process.env.BLOCKCYPHER_TOKEN;
    }

    async generateAddress() {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/addrs?token=${this.token}`);
            return {
                address: response.data.address,
                private: response.data.private,
                public: response.data.public,
                wif: response.data.wif,
            };
        } catch (error) {
            console.error('Error generating new address:', error);
            throw error;
        }
    }

    async checkPayment(address, expectedAmount) {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/addrs/${address}/balance`);
            const balance = response.data.balance / 1e8; // Convert satoshis to BTC
            return balance >= expectedAmount;
        } catch (error) {
            console.error('Error checking payment:', error);
            throw error;
        }
    }
}

module.exports = CryptoPaymentGateway;