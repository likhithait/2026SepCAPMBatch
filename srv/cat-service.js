const cds = require('@sap/cds');
const { mkdirp } = require('@sap/cds/lib/utils/cds-utils');
const {uuid,exists,isdir,read} = cds.utils;

module.exports = cds.service.impl(async function () {

    const {
        EmployeeSrv,
        AddressSrv,
        ProductSrv,
        PurchaseItemSrv,
        BusinessPartnerSrv,
        PurchaseOrderSrv
    } = this.entities;

    this.before('UPDATE', ProductSrv, async (request) => {
        const PRICE = request.data.PRICE;

        if (PRICE > 10000.00) {
            request.error(400, 'Price cannot be greater than 1500000.');
        }
    });

    this.before('createEmployee', async (req) => {

        if (req.data.salaryAmount < 10000) {
            req.error(
                400,
                'Salary should be greater than or equal to 10000'
            );
        }

        const employee = await SELECT.one
            .from(EmployeeSrv)
            .where({
                ID: req.data.ID
            });

        if (employee) {
            req.error(
                400,
                'Employee already exists'
            );
        }
    });


    this.on('createEmployee', async (req) => {

        try {

            const tx = cds.tx(req);

            await tx.run(
                INSERT
                    .into(EmployeeSrv)
                    .entries(req.data)
            );

            return req.data;

        } catch (error) {

            req.error(
                500,
                'Error while creating employee: ' + error.message
            );

        }
    });


    this.on('createAddress', async (req) => {

        try {

            const tx = cds.tx(req);

            await tx.run(
                INSERT
                    .into(AddressSrv)
                    .entries(req.data)
            );

            return req.data;

        } catch (error) {

            req.error(
                500,
                'Error while creating address: ' + error.message
            );

        }
    });

    this.on('createProduct', async (req) => {

        try {

            const tx = cds.tx(req);

            await tx.run(
                INSERT
                    .into(ProductSrv)
                    .entries(req.data)
            );

            return req.data;

        } catch (error) {

            req.error(
                500,
                'Error while creating product: ' + error.message
            );

        }
    });

    this.on('updateEmployee', async (req) => {

        try {

            const {
                ID,
                salaryAmount,
                Currency_code
            } = req.data;

            const tx = cds.tx(req);

            const result = await tx.update(EmployeeSrv)
                .with({
                    salaryAmount,
                    Currency_code
                })
                .where({
                    ID
                });

            if (result === 0) {
                req.error(
                    404,
                    'Employee not found'
                );
            }

            return 'success';

        } catch (error) {

            req.error(
                500,
                'Error while updating employee: ' + error.message
            );

        }
    });

    this.on('updateAddress', async (req) => {

        try {

            const {
                NODE_KEY,
                CITY
            } = req.data;

            const tx = cds.tx(req);

            const result = await tx.update(AddressSrv)
                .with({
                    CITY
                })
                .where({
                    NODE_KEY
                });

            if (result === 0) {
                req.error(
                    404,
                    'Address not found'
                );
            }

            return 'success';

        } catch (error) {

            req.error(
                500,
                'Error while updating address: ' + error.message
            );

        }
    });


    this.on('updateProduct', async (req) => {

        try {

            const {
                NODE_KEY,
                PRICE
            } = req.data;

            const tx = cds.tx(req);

            const result = await tx.update(ProductSrv)
                .with({
                    PRICE
                })
                .where({
                    NODE_KEY
                });

            if (result === 0) {
                req.error(
                    404,
                    'Product not found'
                );
            }

            return 'success';

        } catch (error) {

            req.error(
                500,
                'Error while updating product: ' + error.message
            );

        }
    });


    this.on('deleteProduct', async (req) => {

        try {

            const {
                NODE_KEY
            } = req.data;

            const tx = cds.tx(req);

            const result = await tx.delete(ProductSrv)
                .where({
                    NODE_KEY
                });

            if (result === 0) {
                req.error(
                    404,
                    'Product not found'
                );
            }

            return 'successfully deleted';

        } catch (error) {

            req.error(
                500,
                'Error while deleting product: ' + error.message
            );

        }
    });


    this.on('GetEmployees', async (req) => {

        try {

            const employees = await SELECT
                .from(EmployeeSrv)
                .where({
                    salaryAmount: {
                        '>': 40000
                    }
                });

            return employees;

        } catch (error) {

            req.error(
                500,
                'Error while getting employees: ' + error.message
            );

        }
    });



this.before('UPDATE',ProductSrv, async (request) => {
    const PRICE = request.data.PRICE;

    if (PRICE > 10000.00) {
        request.error(400, 'Price cannot be greater than 1500000.');
    }
});

 this.before('UPDATE',PurchaseItemSrv,async(request,response)=>{
        const salary=request.data.GROSS_AMOUNT;
        const c_code=request.data.CURRENCY_code;
        if(salary>15000 && c_code==="USD"){
            request.error(500,'please contact yout line manager for approval');
        }
        if(salary>10000 && c_code==="EUR"){
            request.error(500,'please contact your regional head');
        }
    });


this.before('UPDATE',AddressSrv,async(request,response)=>{
        const country=request.data.COUNTRY;
        if(country=="GB"||country=="US"){
            request.error(500,'please contact your administrator');
        }
    });
 
    this.before('UPDATE', EmployeeSrv, async (request) => {

        const ph = request.data.phoneNumber;

        const usPhoneRegex = /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;
        const gbPhoneRegex = /^(\+44|44|0)7\d{9}$/;

        if (!usPhoneRegex.test(ph) && !gbPhoneRegex.test(ph)) {
            request.error(400, 'We cannot update your mobile number');
        }
    });



    this.on('getHighestSalariedEmployees', async (request) => {
        try {
            const transaction = cds.tx(request);

            const response = await transaction
                .read(EmployeeSrv)
                .orderBy({
                    salaryAmount: 'desc'
                })
                .limit(10);

            return response;

        } catch (error) {
            request.error(500, error.message);
        }
    });

this.on('getHeighestPricedProduct', async (request) => {
    try {

        const transaction = cds.tx(request);

        const response = await transaction
            .read(ProductSrv)
            .orderBy({
                PRICE: 'desc'
            })
            .limit(1);

        return response;

    } catch (error) {
        request.error(500, error.message);
    }

});

this.on('discountPrice', async(request, response) => {
    try {
        const ID = request.params[0];

        const transaction = cds.tx(request);

        await transaction.update(PurchaseOrderSrv).with({
            GROSS_AMOUNT: {
                '-=': 1000
            },
            NET_AMOUNT: {
                '-=': 800
            },
            TAX_AMOUNT: {
                '-=': 200
            }
        }).where(ID)

        const updatePOInfo = await transaction.read(PurchaseOrderSrv);

        return updatePOInfo;
    } catch (error) {
        return "Error : " + error.toString();
    }
})

this.on('largestOrder', async (request, response) => {
    try {

        // Step-1: Creating object for transaction service using request
        const transaction = cds.tx(request);

        // Step-2: Get top 5 purchase orders based on GROSS_AMOUNT
        const reply = await transaction
            .read(PurchaseOrderSrv)
            .orderBy({
                GROSS_AMOUNT: 'desc'
            })
            .limit(5);

        return reply;

    } catch (error) {
        return "Error : " + error.toString();
    }
});


this.on('increasePrice', ProductSrv, async (request) => {
    try {

        // Step-1: Get key of selected product
        const key = request.params[0];

        // Step-2: Create transaction
        const transaction = cds.tx(request);

        // Step-3: Read selected product
        const product = await transaction
            .read(ProductSrv)
            .where(key);

        if (!product || product.length === 0) {
            return request.error(404, 'Product not found');
        }

        // Step-4: Calculate 10% increase
        const newPrice = Number(product[0].PRICE) * 1.10;

        // Step-5: Update selected product
        await transaction
            .update(ProductSrv)
            .with({
                PRICE: newPrice
            })
            .where(key);

        // Step-6: Return updated product
        const updatedProduct = await transaction
            .read(ProductSrv)
            .where(key);

        return updatedProduct[0];

    } catch (error) {
        return request.error(500, error.message);
    }
});


this.on('top20Products', ProductSrv, async (request) => {
    try {

        const transaction = cds.tx(request);

        const products = await transaction
            .read(ProductSrv)
            .orderBy({
                PRICE: 'desc'
            })
            .limit(20);

        return products;

    } catch (error) {
        return request.error(500, error.message);
    }
});

this.on('increaseSalary', EmployeeSrv, async (request) => {
    try {

        const key = request.params[0];
        const transaction = cds.tx(request);

        const employee = await transaction.read(EmployeeSrv).where(key);
        if (employee.length === 0) {
            return request.error(404, 'Employee not found');
        }

        const newSalary = Number(employee[0].salaryAmount) * 1.15;

        await transaction
            .update(EmployeeSrv).with({
                salaryAmount: newSalary
            })
            .where(key);
        const updatedEmployee = await transaction.read(EmployeeSrv).where(key);
        return updatedEmployee[0];

    } catch (error) {
        return request.error(500, error.message);
    }
});


this.on('top20HighestPaidEmployees', EmployeeSrv, async (request) => {
    try {

        const transaction = cds.tx(request);
        const employees = await transaction
            .read(EmployeeSrv)
            .orderBy({
                salaryAmount: 'desc'
            })
            .limit(20);
        return employees;
    } catch (error) {
        return request.error(500, error.message);
    }
});

this.on('getUtilities',async(request,response)=>{
    let vUUID=uuid(), vPackageContent=null, vInput="https%3A%2F%2Fwww.google.com", uri, dirExists=false, isFileExists=false;
    
    if(exists('srv/request.http')){
        isFileExists=true;
    }
    if(isdir('app')){
        dirExists=true;
    }

    try{
        await mkdirp('srv/lib');
        uri=decodeURI(vInput)
        
    }catch{
        uri=vInput;
    }
    vPackageContent = await read('package.json');

    var finalValue={
        uuid:vUUID,
        uri : uri,
        isFileExists: isFileExists,
        dirExists: dirExists,
        packageInfo: vPackageContent
    }
    return finalValue;
})

});