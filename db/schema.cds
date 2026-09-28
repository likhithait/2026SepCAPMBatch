namespace productmanagement.db;

using { cuid, Currency } from '@sap/cds/common';
using { productmanagement.common as common } from './common';

context master {

    entity BusinessPartners {
        key NODE_KEY : common.Guid;
        BP_ROLE : common.Role;
        EMAIL : common.Email;
        MOBILE : common.PhoneNumber;
        FAX : common.String32;
        WEB : common.String255;
        BP_ID : common.Guid;
        COMPANY_NAME : common.String255;

        AD : Association to many Addresses
            on AD.BP = $self;
    }

    entity Addresses : common.Address {
        key NODE_KEY : common.Guid;
        ADDRESS_TYPE : common.String32;
        VAL_START : Date;
        VAL_END : Date;
        LATITUDE : Decimal(15,6);
        LONGITUDE : Decimal(15,6);

        BP : Association to one BusinessPartners;
    }

    entity Products {
        key NODE_KEY : common.Guid;
        PRODUCT_ID : common.String32;
        TYPE_CODE : String(2);
        CATEGORY : common.String255;
        DESCRIPTION : common.String255;
        TAX_TARIF_CODE : Integer;
        MEASURE_UNIT : String(2);
        WEIGHT_MEASURE : Decimal(15,2);
        WEIGHT_UNIT : String(2);
        PRICE : Decimal(15,2);
        CURRENCY_CODE : String(5);
        WIDTH : Decimal(5,2);
        DEPTH : Decimal(5,2);
        HEIGHT : Decimal(5,2);
        DIM_UNIT : String(2);

        SUPPLIERS : Association to BusinessPartners;
    }

    entity Employees : cuid {
        nameFirst : common.String64;
        nameLast : common.String64;
        nameIntitals : common.String64;
        nameMiddle : common.String64;
        gender : common.Gender;
        language : String(2);
        loginName : String(16);
        phoneNumber : common.PhoneNumber;
        email : common.Email;
        Currency : Currency;
        salaryAmount : common.AmountT;
        accountNumber : common.String32;
        bankId : String(16);
        bankName : common.String64;
    }
}


context transaction {

    entity PurchaseOrders : common.Amount {
        key NODE_KEY : common.Guid;
        PO_ID : common.Guid;

        PARTNER : Association to master.BusinessPartners;

        LIFECYCLE_STATUS : String(1);
        OVERALL_STATUS : String(1);

        Items : Association to many PurchaseItems
            on Items.PARENT = $self;
    }

    entity PurchaseItems : common.Amount {
        key NODE_KEY : common.Guid;

        PARENT : Association to PurchaseOrders;

        PO_ITEM_POS : Integer;

        PRODUCT : Association to master.Products;
    }
}