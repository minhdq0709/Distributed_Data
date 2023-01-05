const fs = require('fs');
const readline = require('readline');
const Si_Data_Source_Post_Model = require("./Si_Data_Source_Post_Model");
let listIdSlave = [];
const limit = 200;

class HandleModel {
    constructor(options) {
        this.consumer = options.consumer;
        this.Init("./IdSlave.txt");
        this.ListeningData();
        this.timer = setInterval(this.DistributedData.bind(this), 10 * 60 * 1000);
    }

    Init(pathFile){
        /* Read old id slave from file */
        const fileStream = fs.createReadStream(pathFile);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        
        rl.on('line', (line) => {
            listIdSlave.push(+line);
        });
    }

    ListeningData(){
        this.consumer.on("ReceiveData", (idSlave) => {
            if (!listIdSlave.includes(idSlave)){

                listIdSlave.unshift(idSlave);
                try{
                    this.AppendFile("./IdSlave.txt", `${idSlave}\n`);
                }
                catch(e){
                    console.log("e: ", e);
                }
            }
        });
    }

    async DistributedData(){
        try {
            const lengthSlave = listIdSlave.length;
    
            if(lengthSlave == 0) {
                return;
            }
    
            let si_Data_Source_Post_Model = new Si_Data_Source_Post_Model();
            let listIdPost = await si_Data_Source_Post_Model.GetListIdPost(lengthSlave * limit);
            
            if(listIdPost && listIdPost.length){
                let start = 0;
    
                for(let i = 0; i < lengthSlave; ++i){
                    start = i * limit;
                    let childData = listIdPost.slice(start, start + limit)
                        .map((obj) => obj.id)
                        .join(',');
    
                    if(childData){
                        /* Update index slave */
                        si_Data_Source_Post_Model.UpdateIndexSlaveToTableSi_Demand_Source_Post(childData, listIdSlave[i]);
                    }
                }

                /* Free memory */
                listIdPost = [];
            }
        }
        catch(e) {
            console.log("Ex: ", e);
        }        
    }

    Sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    AppendFile(pathFile, data){
        fs.appendFile(pathFile, data, function (err) {
            if (err){
                throw err;
            }
        });
    }
}

module.exports = HandleModel;