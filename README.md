# generic-typescript-factory

Provides a generic abstract factory, accepting classes as constructor parameters to create objects (using a simple mapping logic).

## Installation

Use the node package manager [npm](https://www.npmjs.com/package/generic-typescript-factory) to install.

```bash
npm i generic-typescript-factory
```

## Here's an example of usage
First define your factory class which extends from **GenericFactory**.

```typescript
import { DataserviceGeneralErrors } from "../general-errors";
import { DataserviceFluentValidationErrors } from "../fluent-validation-errors";
import { SupportedErrorsType } from "../../supported-errors.type";
import { GenericFactory } from "generic-typescript-factory";

export class SupportedErrorsFactory extends GenericFactory<
	SupportedErrorsType
> {
	constructor() {
		super([DataserviceFluentValidationErrors, DataserviceGeneralErrors]);
	}

	protected onCreateObj(
		createdErrorObj: SupportedErrorsType
	): SupportedErrorsType {
		createdErrorObj.setErrorsToToast();
		return createdErrorObj;
	}
}

```

Now you would be able to instantiate the objects of **DataserviceFluentValidationErrors** or **DataserviceGeneralErrors** classes by using **new SupportedErrorsFactory().create(obj)**.
- **onCreateObj** method will be called **on creation of the object**.(You can apply your custom logic inside that method)
```typescript

this.httpClient
	.post(
		urlToPost,
		values
	)
	.toPromise()
	.catch((response: HttpErrorResponse) => {
		let errorObj: SupportedErrorsType = new SupportedErrorsFactory().create(
			response.error
		);
		errorObj.toastErrors();
		return Promise.reject("promise rejected");
	});
```
In here we catched **SupportedErrorsType**'s (error types that can return from our api) instantiated the objects(using our factory) and applied our logic to toast those errors.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
