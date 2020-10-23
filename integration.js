let web3js;

const isMetaMaskInstalled = () => {
    const {ethereum} = window;
    return Boolean(ethereum&&ethereum.isMetaMask);
};

async function connectMetamask() {
    if(!isMetaMaskInstalled()){
        alert('метамаск отсутствует');
    } else {
        await window.ethereum.enable();
        web3js = new Web3(web3.currentProvider);

        setProviders();

        alert('метамаск подключен');
    }
};

// TODO: walletConnect
async function connectWalletConnect() {

}

function setProviders() {
    //Подключаем контракты
    window.kernelContract = web3js.eth.Contract(kernelABI).at(kernelAddr);
    window.feeAproverContract = web3js.eth.Contract(feeAproverABI).at(feeAproverAddr_proxy);
    window.stakingContract = web3js.eth.Contract(stakingABI).at(stakingAddr_proxy);
    window.LPTokenContract = web3js.eth.Contract(LPTokenABI).at(LPTokenAddr);
    window.wethContract = web3js.eth.Contract(wethABI).at(wethAddr);
}


//-- GET FUNCTIONS --
/**
 * есть смысл запустить таймер который будет раз в период вызывать все геттеры
 * setInterval(cycleOfGetters, 1500);
*/
function cycleOfGetters() {
    getTotalKRL();
    getMyKRL();
    getMyClaimableKRL();
    getTotalLP();
    getMylLP();
    getStakedLP();
    getAPY();
    getClaimableLP();
    getTotalETHContributed();
    getLPTotalSupply();
    getLPPrice();
    getLPCap();
    getPairBalance();
    getLPStatus();
    getLPtimeToEnd();
};

//--summary--
    //Kernel total
    const getTotalKRL = async () => {
        let totalKRL = await _getTotalKRL();
        console.log('totalKRL', totalKRL)
        // getElementById();
    }
    //Kernel wallet 
    const getMyKRL = async () => {
        let myKRL = await _getMyKRL();
        console.log('myKRL', myKRL)
        // getElementById();
    }
    //Kernel Claimable
    const getMyClaimableKRL = async () => {
        let myClaimableKRL = await _getMyClaimableKRL();
        console.log('myClaimableKRL', myClaimableKRL)
        // getElementById();
    }

    //KRL/WETHLP total
    const getTotalLP = async () => {
        let totalLP = await _getTotalLP();
        console.log('totalLP', totalLP)
        // getElementById();
    }
    //KRL/WETHLP wallet
    const getMylLP = async () => {
        let myLP = await _getMyLP();
        console.log('myLP',  myLP)
        // getElementById();
    }
    //KRL/WETHLP staked
    const getStakedLP = async () => {
        let myStakedLP = await _getStakedLP();
        console.log('myStakedLP', myStakedLP)
        // getElementById();
    }
// ----

// -- farm --
    //Staked -> KRL/WETHLP staked

    //APY -> вроде такой же как и под формой
    const getAPY = async () => {
        let APY = await _getAPY();
        console.log('APY', APY)
        // getElementById('id_элемента_где_выводится_APY').value = APY;
    }
    //Claimable
    const getClaimableLP = async () => {
        let claim = await _getClaimableLP();
        console.log('getClaimableLP', claim);
        // getElementById();
    }
// ----

//--- Uniswap ---
    //Всего собрано ETH
    const getTotalETHContributed = async () => {
        let totalETH = await _getTotalETHContributed();
        console.log('getTotalETHContributed', totalETH);
        // getElementById();
    }
    //Выпущено LP
    const getLPTotalSupply = async () => {
        let LPTotalSupply = await _getLPTotalSupply();
        console.log('LPTotalSupply', LPTotalSupply);
        // getElementById();
    }
    // Цена LP в ETH (примерная)
    const getKernelPrice = async () => {
        let KernelPrice = await _getKernelPrice();
        console.log('KernelPrice', KernelPrice);
        // getElementById();
    }
    // Цена LP в ETH (примерная)
    const getLPPrice = async () => {
        let LPPrice = await _getLPPrice();
        console.log('LPPrice', LPPrice);
        // getElementById();
    }
    // Капитализация LP в ETH (примерная)
    const getLPCap = async () => {
        let LPCap = await _getLPCap();
        console.log('getLPCap', LPCap);
        // getElementById();
    }
    // Баланс LP в Kernel и WETH
    const getPairBalance = async () => {
        let {WETH, Kernel} = await _getPairBalance();
        console.log('pairBalance', WETH, Kernel);
        // getElementById();
    }
    //Сбор завершен -> bool
    const getLPStatus = async () => {
        let LPStatus = await _getLPStatus();
        console.log('LPStatus', LPStatus);
        // getElementById();
    }
    //Время до конца сборов в секундах
    const getLPtimeToEnd = async () => {
        let LPtimeToEnd = await _getLPtimeToEnd();
        console.log('LPtimeToEnd', LPtimeToEnd);
        // getElementById();
    }

//-- CALL FUNCTIONS -- Повесить инветы на соответствующие кнопки

/**  
 * Активная пока идут сборы + рядом кнокпка claimLP, далее вместо нее кнопка -> внести депозит (Stake LP) и рядом widhdrawLP
 * её бы вынести на время сбора вперёд, пока LP 
 * 
 * @params amount <Number> - количество закидываемое в LP, в эфирах (eth)
 * */
const callbuyLP = async (amount) => {
    await _callbuyLP(amount);
}
// по сути редирект на uniswap, активна когда сбор завершен
const callBuyKernel = async () => {
    let url = `https://app.uniswap.org/#/swap?outputCurrency=${kernelAddr}`;
    let win = window.open(url, '_blank');
    win.focus();
}
/**
 * widhdraw kernel - забираем kernel из депозитов [их пока нет]
 *  
 * @params pid <Number> - номер депозита, у на пока только 0
 * @params amount <Number> - количество Kernel (умножить на e18, так как числа после запятой)
 * */ 
const callWidhdrawKernel = async (pid, amount) => {
    await _callWidhdrawKernel(pid, amount);
}
