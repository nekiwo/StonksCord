

module.exports = {
	GetStockInfo: (code) => {
        
        let memberCount = 10; // todo, be the actual member count
        if(memberCount < 10) {
            return false;
        }
        else {
            let totalStocksOwned = 10; // todo be real

            let stockPrice = memberCount + (totalStocksOwned * 0.1);

            return stockPrice;
        }
    }
};