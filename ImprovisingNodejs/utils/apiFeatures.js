class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryObj = {...this.queryString};
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el=>delete queryObj[el]);


        let queryStr = JSON.stringify(queryObj);
        // eslint-disable-next-line no-unused-expressions
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`);

        this.query.find(JSON.parse(queryStr));
        
        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryString.page || this.queryString.limit){
        //     const numTours = await Tour.countDocuments();
        //     if(skip>=numTours) throw new Error('This page doesnt exist!');
        //     if(limit>numTours) throw new Error('This data limit doesnt exist!');
        // }

        return this;

    }
}

module.exports = APIFeatures;
