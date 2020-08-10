const NotaryV2 = artifacts. require("NotaryV2");

var accounts;
var owner;

contract ('NotaryV2', (accs) => {
    accounts = accs;
    owner =accounts[0];
});

it('can create a star', async() => {
    let tokenId = 1;
    let instance = await NotaryV2.deployed();

    await instance.createStar("My star", tokenId, {from: accounts[0]})
    assert.equal (await instance.tokenIdToStarInfo. call(tokenId), "My star")
});

it("let user1 put their star for sale" , async() =>{
    let instance = await NotaryV2.deployed();
    let user1 =accounts[1];
    let starId =2;
    let starPrice =web3.utils.toWei(".01", "ether");

    await instance.createStar("My star", starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from:user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

// it('lets user1 get the funds after the sale', async() => {
//     let instance = await NotaryV2.deployed();
//     let user1 = accounts[0];
//     let user2 = accounts[1];
//     let starId = 3;
//     let starPrice = web3.utils.toWei(".01", "ether");
//     let balance = web3.utils.toWei(".05", "ether");
//     await instance.createStar('awesome star', starId, {from: user1});
//     await instance.putStarUpForSale(starId, starPrice, {from: user1});
//     let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
//     await instance.buyStar(starId, {from: user2, value: balance});
//     let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
//     let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
//     let value2 = Number(balanceOfUser1AfterTransaction);
//     assert.equal(value1, value2);
// });



// it("lets user2 buy a star, if it is up for sale", async() => {
//     let instance = NotaryV2.deployed();
//     let user1 = accounts[1];
//     let user2 = accounts[2];
//     let starId =5;
//     let starPrice = web3.utils.toWei(".01", "ether");
//     let balance = web3.utils.toWei(".05", "ether");

//     await instance.createStar("my star", starId, {from: user1});
//     await instance.putStarUpForSale(starId, starPrice, {from:user1});

//     let balanceOfUser2BeforeTransaction = await web3.utils.getBalance(user2);
//     await instance.buyStar(starId, {from:user2, value:balance});
//     assert.equal(await instance.ownerOf(starId), user2);
// })

it("lets user2 buy a star and decreases its balance in eth", async() => {
    let instance = NotaryV2.deployed;
    let user1 = accounts[1];
    let user2 =accounts[2];
    let starId =5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance =web3.utils.toWei(".05", "ether");

    await instance.createStar("my star", starId, {from:user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    // let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buy(starId, {from: user2, value: starPrice, gasPrice:0 });

    const balanceOfUser2AfterTransaction = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceOfUser2AfterTransaction);
    assert.equal(value, starPrice);

})