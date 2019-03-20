var Ownable = artifacts.require("./zeppelin/ownership/Ownable.sol");
var Killable = artifacts.require("./zeppelin/lifecycle/Killable.sol");
var SafeMath = artifacts.require("./zeppelin/math/SafeMath.sol");
var ReentryProtector = artifacts.require("./ReentryProtector.sol");
var Authentication = artifacts.require("./Authentication.sol");
var Ecommerce = artifacts.require("./Ecommerce.sol");
var Escrow = artifacts.require("./Escrow.sol");

var testcase = require('../src/initialstate.json')

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Ownable);
  deployer.deploy(Killable);
  deployer.deploy(SafeMath);
  deployer.deploy(ReentryProtector);
  deployer.deploy(Escrow, 0, "0x0", "0x0", "0x0");

  deployer.link(SafeMath, Ecommerce);
  deployer.link(ReentryProtector, Ecommerce);
  deployer.link(Escrow, Ecommerce);

  let ecommerce;
  let authentication;
  deployer.deploy(Ecommerce).then(function(depEcommerce) {
    ecommerce = depEcommerce;
    deployer.link(Ownable, Authentication);
    deployer.link(Killable, Authentication);
    deployer.link(SafeMath, Authentication);
    deployer.link(ReentryProtector, Authentication);
    deployer.link(Ecommerce, Authentication);
    return deployer.deploy(Authentication, depEcommerce.address );
  }).then((ans) => {
    authentication = ans;
    return ans;
  }).then(()=>{
    console.log("\n\nsign up\n");
    for(let i = 1; i<testcase.userData.length;i++){
      let role;
      //console.log(testcase.userData[i]);
      if(testcase.userData[i].userType === "Buyer")  role = 0;
      else if(testcase.userData[i].userType === "Seller")  role = 1;
      else if(testcase.userData[i].userType === "Arbiter")  role = 2;
      else  role = 3;
      testcase.userData[i].userType = role;
    }

/*    for (let i = 1, p = Promise.resolve(); i < testcase.userData.length; i++) {
      p = p.then(_ => new Promise(resolve =>
          setTimeout(function () {
              return authentication.signup(testcase.userData[i].name, 
                testcase.userData[i].email,
                testcase.userData[i].phoneNumber, 
                testcase.userData[i].profilePicture, 
                testcase.userData[i].userType,
                {from: accounts[i]} );
              //resolve();
          }, 2000)
      ));
    }
    */
/*    let i = 1;
    (function loop(i) {
        if (i < testcase.userData.length) new Promise((resolve, reject) => {
            setTimeout( () => {
                authentication.signup(testcase.userData[i].name, 
                testcase.userData[i].email,
                testcase.userData[i].phoneNumber, 
                testcase.userData[i].profilePicture, 
                testcase.userData[i].userType,
                {from: accounts[i]} );

                console.log(i);
                resolve();
            }, 3000);
        }).then(loop.bind(null, i+1));
    })(0);
    */
    //console.log(testcase.userData[i]);
  }).then(()=>{
    // console.log("\n\napproving\n");
    // for(let i = 1; i<testcase.userData.length;i++){
    //   authentication.updateUserState(accounts[i], {from: accounts[0]} );
    // }
    return Promise.resolve("approving");
  });
};

/*
var Authentication_flat = artifacts.require('../contracts_flat/Authentication_flat.sol');

module.exports = function(deployer) {
	deployer.deploy(Authentication_flat);
}
*/