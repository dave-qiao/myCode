import request from '../../../aoao-core-api-service/src/utils/request';
import qs from 'qs';


export async function areas_total_list(vendorId) {
  const params = {
    vendor_id:vendorId,
  };
  return request(`areas/total_list?${qs.stringify(params)}`)
          .then((data) => {
            const result = [];
            data.data.data.forEach((item)=>{
              if (item.hasOwnProperty('vendor') === true) {
                item.name = `${item.name}(${item.vendor.name})`;
                item.vendor_id = item.vendor.id;
                result.push(item);
              }
            })
            return result;
          });
}
