class EligibilityService {
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {

    for(const criteriaKey in criteria) {

      if(criteriaKey.split('.').length > 1) {
        const path = criteriaKey.split('.');

        if (typeof cart[path[0]] === "undefined") {
          console.log(`Property '${path[0]}' does not exist in this cart`);
          
          return false;
        }
        
        let validation = false;
        if(Array.isArray(cart[path[0]])) {
          cart[path[0]].forEach(element => {
            if (typeof element[path[1]] === "undefined") {
              console.log(`Property '${path[1]}' does not exist in ${path[0]} objects`);
            } else {
              if(checkSingleCriteria(criteria[criteriaKey], element[path[1]])) validation = true;
            }
          });
        } else if (typeof(cart[path[0]]) === 'object') {
          if (typeof cart[path[0]][path[1]] === "undefined") {
              console.log(`Property '${path[1]}' does not exist in ${path[0]} object`);
              
              return false;
            } else {
              if(checkSingleCriteria(criteria[criteriaKey], cart[path[0]][path[1]])) validation = true;
            }
        }
      
        if(!validation) return false;

      } else {
        if (typeof cart[criteriaKey] === "undefined") {
          console.log(`Property '${criteriaKey}' does not exist in this cart`);
          
          return false;
        } else {
          if(!checkSingleCriteria(criteria[criteriaKey], cart[criteriaKey])) return false;
        }
      }
    }

    return true;
  }
}

checkSingleCriteria = (criteriaField, cartField) => {
  if(typeof(criteriaField) === 'object') { 
    if( !isNaN(Date(Date.parse(cartField))) ) {
      cartField = Date.parse(cartField)
    }
    for(const conditionType in criteriaField) {
      if( !isNaN(Date(Date.parse(criteriaField[conditionType]))) ) {
        criteriaField[conditionType] = Date.parse(criteriaField[conditionType])
      }
      switch(conditionType) {
        case "gt":
          if(!(cartField > criteriaField[conditionType])) {
            return false;
          }
          break;
        case "lt":
          if(!(cartField < criteriaField[conditionType])) {
            return false;
          }
          break;
        case "gte": 
        if(!(cartField >= criteriaField[conditionType])) {
          return false;
        }
          break;
        case "lte":
          if(!(cartField <= criteriaField[conditionType])) {
            return false;
          }
          break;
        case "in": 
          if(!(criteriaField[conditionType].includes(cartField))) {
            return false;
          }
          break;
        case "and":
          let andValidation = true;
          for(const andConditionKey in criteriaField[conditionType]) {
            if(!checkSingleCriteria({[andConditionKey]: criteriaField[conditionType][andConditionKey]}, cartField)) andValidation = false;
          }
          if(!andValidation) return false;
          break;
        case "or":
          let orValidation = false;
          for(const orConditionKey in criteriaField[conditionType]) {
            if(checkSingleCriteria({[orConditionKey]: criteriaField[conditionType][orConditionKey]}, cartField)) orValidation = true;
          }
          if(!orValidation) return false;
          break;
      }
    }
  } else {
    if(!(cartField == criteriaField)) return false;
  }

  return true;
}


module.exports = {
  EligibilityService,
};
