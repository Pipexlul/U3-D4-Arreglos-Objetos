const propiedadesJSON = [
  {
    name: "Casa de campo",
    description: "Un lugar ideal para descansar de la ciudad",
    src: "https://www.construyehogar.com/wp-content/uploads/2020/02/Dise%C3%B1o-casa-en-ladera.jpg",
    rooms: 2,
    m: 170,
  },
  {
    name: "Casa de playa",
    description: "Despierta tus días oyendo el oceano",
    src: "https://media.chvnoticias.cl/2018/12/casas-en-la-playa-en-yucatan-2712.jpg",
    rooms: 2,
    m: 130,
  },
  {
    name: "Casa en el centro",
    description: "Ten cerca de ti todo lo que necesitas",
    src: "https://fotos.perfil.com/2018/09/21/trim/950/534/nueva-york-09212018-366965.jpg",
    rooms: 1,
    m: 80,
  },
  {
    name: "Casa rodante",
    description: "Conviertete en un nómada del mundo sin salir de tu casa",
    src: "https://cdn.bioguia.com/embed/3d0fb0142790e6b90664042cbafcb1581427139/furgoneta.jpg",
    rooms: 1,
    m: 6,
  },
  {
    name: "Departamento",
    description: "Desde las alturas todo se ve mejor",
    src: "https://www.adondevivir.com/noticias/wp-content/uploads/2016/08/depto-1024x546.jpg",
    rooms: 3,
    m: 200,
  },
  {
    name: "Mansión",
    description: "Vive una vida lujosa en la mansión de tus sueños ",
    src: "https://cloudfront-us-east-1.images.arcpublishing.com/lanacionar/CUXVMXQE4JD5XIXX4X3PDZAVMY.jpg",
    rooms: 5,
    m: 500,
  },
];

const inputRooms = document.querySelector("#input-rooms");
const metersFrom = document.querySelector("#meters-from");
const metersTo = document.querySelector("#meters-to");
const buttonFilter = document.querySelector("#button-filter");
const totalProperties = document.querySelector("#total-properties");
const propertiesContainer = document.querySelector("#properties");

const filterMap = new Map([
  [0, "Cuartos"],
  [1, "Metros Desde"],
  [2, "Metros Hasta"],
]);

const setInvalidResult = (resultObj, reason) => {
  resultObj.valid = false;
  resultObj.errorMessage = reason;
};

const validateInput = (input, validatorsArray) => {
  const result = {
    valid: true,
    errorMessage: "",
  };

  for (const validatorFuncData of validatorsArray) {
    if (!validatorFuncData.func(input)) {
      setInvalidResult(result, validatorFuncData.reason);
      break;
    }
  }

  return result;
};

const validateLength = (valStr) => !!valStr.length;
const validatePositive = (valStr) => Number(valStr) >= 0;
const validateInteger = (valStr) => Number.isInteger(Number(valStr));

const validators = [
  { func: validateLength, reason: "Campo está vacío" },
  { func: validatePositive, reason: "Campo no puede ser un número negativo" },
  { func: validateInteger, reason: "Campo debe ser un número entero" },
];

const validateInputs = (inputArray) => {
  const result = {
    valid: true,
    errorMessage: "",
  };

  const faultyValues = [];

  inputArray.forEach((input, idx) => {
    const result = validateInput(input, validators);

    if (!result.valid) {
      faultyValues.push({
        culprit: filterMap.get(idx),
        msg: result.errorMessage,
      });
    }
  });

  const faultyLength = faultyValues.length;

  if (faultyLength) {
    const msg = faultyValues.reduce(
      (prev, cur) => {
        const { culprit, msg } = cur;
        const errorMsg = `\nInput ${culprit}: ${msg}`;

        return (prev += errorMsg);
      },
      faultyLength === 1 ? "Error detectado:" : "Errores detectados:"
    );

    setInvalidResult(result, msg);
  }

  return result;
};

const getMatchingProperties = (roomsFilter, fromMeters, toMeters) => {
  const result = [];

  for (const propertyData of propiedadesJSON) {
    const { rooms, m } = propertyData;

    if (rooms >= roomsFilter && fromMeters <= m && m <= toMeters) {
      result.push(propertyData);
    }
  }

  return result;
};

const constructPropertyHTML = (propertyData) => {
  const { name, description, src, rooms, m } = propertyData;

  return `
    <div class="propiedad">
      <div
      class="img"
      style="
      background-image: url(${src});
      "
      ></div>
      <section>
        <h5>${name}</h5>
        <div class="d-flex justify-content-between">
          <p>Cuartos: <br />${rooms}</p>
          <p>Metros: <br />${m}</p>
        </div>
        <p class="my-3">${description}</p>
        <button class="btn btn-info">Ver más</button>
      </section>
    </div>
    `;
};

const buildHtmlString = (propertiesArray) => {
  return propertiesArray.reduce((prev, cur) => {
    const toHtmlTemplate = constructPropertyHTML(cur);

    return (prev += toHtmlTemplate);
  }, "");
};

const setup = () => {
  const htmlString = buildHtmlString(propiedadesJSON);
  const arrLength = propiedadesJSON.length;

  propertiesContainer.innerHTML = htmlString;
  totalProperties.textContent = arrLength;

  inputRooms.value = 0;
  metersFrom.value = 0;
  metersTo.value = 1000;
};

buttonFilter.addEventListener("click", (ev) => {
  const inputs = [inputRooms.value, metersFrom.value, metersTo.value];

  const result = validateInputs(inputs);

  if (!result.valid) {
    alert(result.errorMessage);
    return;
  }

  const asNumbers = inputs.map((val) => {
    return Number(val);
  });

  const [roomNum, fromNum, toNum] = asNumbers;

  const validProperties = getMatchingProperties(roomNum, fromNum, toNum);

  const htmlString = buildHtmlString(validProperties);

  propertiesContainer.innerHTML = htmlString;
  totalProperties.textContent = validProperties.length;
});

setup();
