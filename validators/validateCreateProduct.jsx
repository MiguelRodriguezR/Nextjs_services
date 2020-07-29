export default function validateCreateProduct(values){
    let errors = {};

    !/^(ftp|http|https):\/\/[^ "]+$/.test(values.url) ? errors.url = 'type a valid URL': void(0);

    Object.keys(values).map( k => {
        if (k === 'image') return;
        !values[k] ? errors[k] = `${k} is required`: void(0); 
    })
    
    return errors;

}   