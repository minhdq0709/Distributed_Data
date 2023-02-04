"use  strict";
const mysql = require('mysql');
const dbconfig = require('./config/database.js');
const connection = mysql.createConnection(dbconfig.connection);

class Si_Data_Source_Post_Model{
    GetListIdPost(limit){
        let query = `SELECT id FROM social_index_v2.si_demand_source_post
            where platform = 'facebook' 
                and index_slave = 0 
                and status = 0
                and type = 3
            limit 0, ${limit};`;

        return new Promise((resolve, reject)=>{
            connection.query(query,  (error, results)=>{
                if(error){
                    return reject(error);
                }

                return resolve(results);
            });
        });
    }

    UpdateIndexSlaveToTableSi_Demand_Source_Post(listId, indexSlave){
        let query = `UPDATE social_index_v2.si_demand_source_post
            SET index_slave = ${indexSlave}
            WHERE id in (${listId});`;

        return new Promise((resolve, reject)=>{
            connection.query(query,  (error, results)=>{
                if(error){
                    return reject(null);
                }

                return resolve(results);
            });
        });
    }

    UpdateIndexSlaveIsPage(){
        let query = `UPDATE social_index_v2.si_demand_source_post
            SET index_slave = 255
            where platform = 'facebook' 
                and index_slave = 0 
                and status = 0
                and insert_time is NULL
                and type = 2;`;

        return new Promise((resolve, reject)=>{
            connection.query(query,  (error, results)=>{
                if(error){
                    return reject(null);
                }

                return resolve(results);
            });
        });
    }
}

module.exports = Si_Data_Source_Post_Model;
