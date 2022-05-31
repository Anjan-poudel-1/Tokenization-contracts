const Token = artifacts.require("MyToken");
require("dotenv").config({path:"../.env"});
const chai = require('./setupTest');
const BN = web3.utils.BN;

const expect = chai.expect;

contract("Token Test", async(accounts)=>{

    const [deployerAccount,recipient,anotherAccount] = accounts;
    console.log("DeployerAccount",deployerAccount);
    beforeEach(async()=>{
        this.myToken = await Token.new(process.env.INITIAL_TOKEN)
    });

    it("All token should be in my account", async()=>{
        let instance = this.myToken;
        //To get the instance of token 

        let totalSupply = await instance.totalSupply();
        //To get the total Supply

            let balance = await instance.balanceOf(accounts[0]);
            
            //assert.strictEqual(balance,totalSupply,"ERROR");
      return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        //expect resolves promises using eventually


    });


  
    it("Not possible to send tokens more than the upper limit",async()=>{
        let instance = this.myToken;
        //let totalSupply = await instance.totalSupply();
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);
        const sendToken = new BN(balanceOfDeployer+1000);
      
        expect(instance.transfer(recipient,sendToken)).to.eventually.be.rejected;
       return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });

    it("Transfer token success",async()=>{
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        const sentToken = 10;
            const balanceOfDeployer = await instance.balanceOf(deployerAccount);
            try{

                let isTransferred= await instance.transfer(recipient,sentToken);
            }
            catch(err){
                console.log(err)
            }
            const balanceAfterTransfer = await instance.balanceOf(deployerAccount);
            const balanceofRecipient = await instance.balanceOf(recipient);
            console.log("Recipient," , balanceofRecipient);
            console.log("Sender," , balanceAfterTransfer);
            
        //  expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        //  expect(instance.transfer(recipient,sentToken)).to.eventually.be.fulfilled;
        //  console.log("balance of recipeient ",await instance.balanceOf(recipient))
        //  console.log("balance of deployerAccount ",await instance.balanceOf(deployerAccount))
         //return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sentToken)));
       return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sentToken));
    });


   

})