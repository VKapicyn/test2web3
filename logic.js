const _getTotalKRL = async () => {
    // Сколько Kernel эмитировано
    return await kernelContract.methods.totalSupply().call();
}
const _getMyKRL = async () => {
    //Баланс кошелька в Kernel
    return await kernelContract.methods.balanceOf(web3.currentProvider.selectedAddress).call();
}
const _getMyClaimableKRL = async () => {
    // Возвращает данные из нулевого пула [которого пока нет]
    return web3js.utils.fromWei((await stakingContract.methods.pendingKernel('0', web3.currentProvider.selectedAddress).call()), 'ether');
}

const _getTotalLP = async () => {
    // Сколько выпущено Uni-V2 в паре (Kernel -> WETH);
    return await LPTokenContract.methods.totalSupply().call();
}
const _getMyLP = async () => {
    // Баланс кошелька Uni-V2 пары
    return await LPTokenContract.methods.balanceOf(web3.currentProvider.selectedAddress).call();
}
const _getStakedLP = async () => {
    // Возвращает данные из нулевого пула [которого пока нет]
    return web3js.utils.fromWei(+(await stakingContract.methods.userInfo('0', web3.currentProvider.selectedAddress).call()).amount, 'ether');
}

const _getAPY = async () => {
    let dataLP = await LPTokenContract.methods.balanceOf(kernelAddr).call()
    let averageRewards = await stakingContract.methods.averageFeesPerBlockSinceStart().call();
    let wethLP = await wethContract.methods.balanceOf(LPTokenAddr).call();
    let totalLP = await LPTokenContract.methods.totalSupply().call();
    let kernelLP = await kernelContract.methods.balanceOf(LPTokenAddr).call();
    let ethPerLP = (wethLP / totalLP) * 2;
    let ethPerKernel = wethLP / kernelLP;
    let lockedLPValue = web3js.utils.fromWei(dataLP,'ether') * ethPerLP;
    let kernelPerYear = web3js.utils.fromWei(averageRewards,'ether') * 2103840; //2103840 WTF???
    let ethPerYear = kernelPerYear * ethPerKernel;

    let APY = ethPerYear / lockedLPValue  * 100;
    return APY;
}

// TODO: 
const _getTotalETHContributed = async () => {
    // всего собрано эфира
    return web3js.utils.fromWei(await kernelContract.methods.totalETHContributed.call().call(), 'ether');
};
const _getLPTotalSupply = async () => {
    // всего LP Uni v2 токенов
    return await LPTokenContract.methods.totalSupply().call();
};
const _getKernelPrice = async () => {
    let wethLP = await wethContract.methods.balanceOf(LPTokenAddr).call();
    let kernelLP = await kernelContract.methods.balanceOf(LPTokenAddr).call();

    return wethLP / kernelLP;
};
const _getLPPrice = async () => {
    let wethLPX2 = 2 * (await wethContract.methods.balanceOf(LPTokenAddr).call());
    return wethLPX2 / (await _getLPTotalSupply());
};
const _getLPCap = async () => {
    return 2 * (await wethContract.methods.balanceOf(LPTokenAddr).call());
};
const _getPairBalance = async () => {
    let {Kernel, WETH, timestamp } = await LPTokenContract.methods.getReserves().call();
    console.log('timestamp', timestamp);
    return { WETH, Kernel };
};
const _getLPStatus = async () => {
    return await kernelContract.methods.liquidityGenerationOngoing().call();
};
const _getLPtimeToEnd = async () => {
    return await kernelContract.methods.getSecondsLeftInLiquidityGenerationEvent().call();
};
const _getClaimableLP = async () => {
    return await kernelContract.methods.canClaimLP(web3.currentProvider.selectedAddress).call();
}

//sends
const _callbuyLP = async (amount) => {
    await kernelContract.methods.addLiquidity(true).send({
        from: web3.currentProvider.selectedAddress,
        value: web3js.utils.toWei(amount)
    });
};
const _callClaimLP = async () => {
    await kernelContract.methods.claimLPTokens().send({
        from: web3.currentProvider.selectedAddress
    });
}
const _callWidhdrawKernel = async (pid, amount) => {
    await kernelContract.methods.withdraw(pid, amount).send({
        from: web3.currentProvider.selectedAddress
    });
};
