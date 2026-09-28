using { productmanagement.db as database } from '../db/schema';
using { productmanagement.common as common } from '../db/common';

service CatalogService {

    @Capabilities : { 
        InsertRestrictions.Insertable:true,
        UpdateRestrictions.Updatable:true,
        DeleteRestrictions.Deletable:true,
        ReadRestrictions.Readable:true
       
     }

    entity EmployeeSrv
        as projection on database.master.Employees{
            *
        }
        actions {
            action increaseSalary() returns EmployeeSrv;
            function top20HighestPaidEmployees() returns array of EmployeeSrv;
        };

    entity ProductSrv
        as projection on database.master.Products{
            *
        }
    actions {
        action increasePrice() returns ProductSrv;
        function top20Products() returns array of ProductSrv;
    };

    entity BusinessPartnerSrv
        as projection on database.master.BusinessPartners;

    entity AddressSrv
        as projection on database.master.Addresses;

    entity PurchaseOrderSrv
        as projection on database.transaction.PurchaseOrders {
        *
        }
    actions {
        action discountPrice() returns array of PurchaseOrderSrv;
    };

    entity PurchaseItemSrv
        as projection on database.transaction.PurchaseItems;


    action createEmployee(
        ID : UUID,
        nameFirst : common.String64,
        nameLast : common.String64,
        nameIntitals : common.String64,
        nameMiddle : common.String64,
        gender : common.Gender,
        language : String(2),
        loginName : String(16),
        phoneNumber : common.PhoneNumber,
        email : common.Email,
        Currency_code : String(3),
        salaryAmount : common.AmountT,
        accountNumber : common.String32,
        bankId : String(16),
        bankName : common.String64
    ) returns EmployeeSrv;


    action createAddress(
        NODE_KEY : common.Guid,
        ADDRESS_TYPE : common.String32,
        VAL_START : Date,
        VAL_END : Date,
        LATITUDE : Decimal(15,6),
        LONGITUDE : Decimal(15,6),
        STREET : common.String255,
        POSTAL_CODE : String(12),
        CITY : common.String255,
        COUNTRY : common.String255,
        BUILDING : common.String255
    ) returns AddressSrv;


    action updateEmployee(
        ID : UUID,
        salaryAmount : common.AmountT,
        Currency_code : String(3)
    ) returns String;


    action updateAddress(
        NODE_KEY : common.Guid,
        CITY : common.String255
    ) returns String;


    action createProduct(
        NODE_KEY : common.Guid,
        PRODUCT_ID : common.String32,
        TYPE_CODE : String(2),
        CATEGORY : common.String255,
        DESCRIPTION : common.String255,
        TAX_TARIF_CODE : Integer,
        MEASURE_UNIT : String(2),
        WEIGHT_MEASURE : Decimal(15,2),
        WEIGHT_UNIT : String(2),
        PRICE : Decimal(15,2),
        CURRENCY_CODE : String(5),
        WIDTH : Decimal(5,2),
        DEPTH : Decimal(5,2),
        HEIGHT : Decimal(5,2),
        DIM_UNIT : String(2)
    ) returns ProductSrv;


    action updateProduct(
        NODE_KEY : common.Guid,
        PRICE : Decimal(15,2)
    ) returns String;


    action deleteProduct(
        NODE_KEY : common.Guid
    ) returns String;


    action GetEmployees()
        returns array of EmployeeSrv;


    function getHighestSalariedEmployees() returns array of EmployeeSrv;

    function getHeighestPricedProduct() returns array of ProductSrv;

    function largestOrder() returns array of PurchaseOrderSrv;

    function getUtilities() returns String;
    
    
}
