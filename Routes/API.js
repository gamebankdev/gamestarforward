const  Router = require('koa-router');
const router=new Router()
const gamebank = require('gamebank');
const Customer = require('config').get('Customer');
gamebank.api.setOptions({ url: Customer.gamebankOption.server })
gamebank.config.set('address_prefix',Customer.gamebankOption.address_prefix);
gamebank.config.set('chain_id',Customer.gamebankOption.chain_id);
router.post('/API/:attribute/:method',ctx=>{
  return new Promise((resolve,reject)=>{
      try{
        const {attribute,method}=ctx.params
        const params = JSON.parse(ctx.request.body)
        if(attribute=='broadcast' && method=='accountCreate'){
            if(params.length!=2||params[0]==''|| params[1]==''){
                throw 'Parameter error'
            }
            const arr = []
            const wif=Customer.initAcoount.wif
            const initName=Customer.initAcoount.initName
            const fee=Customer.initAcoount.fee
            const generateKeys = GameBank.auth.generateKeys(params[0], params[1], ['owner','active','posting','memo']);
            const metadata = '';
            const owner = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[generateKeys.owner, 1]],
            };
            const active = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[generateKeys.active, 1]],
            };
            const posting = {
                weight_threshold: 1,
                account_auths: [],
                key_auths: [[generateKeys.posting, 1]],
            };
            const memoKey=generateKeys.memo;
            arr.push(wif,fee,initName,params[0],owner,active,posting,memoKey,metadata)
            params=arr
        }
        params.push(function(err,result){
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
        gamebank[attribute][method].apply(null,params)
     }catch(err){
        reject(err)
     }
    })
    .then(res=>{
        ctx.body=res
        ctx.status=200
    })
    .catch(err=>{
        console.log(err)
        ctx.body=err
        ctx.status=400
    })
})

module.exports=router
