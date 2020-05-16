interface ClassInfo {
	propNames: string[];
	instance: any;
}


export interface Constructable<T> {
	new (...args: any): T;
}

export abstract class GenericFactory<T> {
	private supportedClassInfos: ClassInfo[] = [];

	constructor(private supportedClasses: Array<Constructable<T>>) {
		this.setSupportedClassInfos();
	}

	protected abstract onCreateObj(obj: T): T;

	public create(obj: T) {
        let createdObj = this.initObj(obj);
        if(createdObj){
            createdObj = this.onCreateObj(createdObj);
            if (createdObj) return createdObj;
        }
        throw "couldn't initialize the object"
	}

	private initObj(obj: T): T|undefined {
		let objPropsLowercase: string[] = TypesafeMapper.helpers.getCamelizedProperties(
			obj
		);
		let createdObj: T|undefined= undefined;
		this.supportedClassInfos.forEach(supportedClassInfo => {
			const typeFound: boolean = objPropsLowercase.every(propName =>
				supportedClassInfo.propNames.includes(propName)
			);
			if (typeFound) {
				let result = new TypesafeMapper.TypesafeMapper().map<T>(
					supportedClassInfo.instance,
					obj
				);
				createdObj = result;
			}
		});
		return createdObj;
	}

	private setSupportedClassInfos(): void {
		this.supportedClasses.forEach((b: Constructable<T>) => {
			let propNames: Array<string> = [];
			for (let key in new b()) {
				propNames.push(key);
			}
			this.supportedClassInfos.push({
				propNames: propNames,
				instance: new b()
			});
		});
	}
}


namespace TypesafeMapper {
	export class TypesafeMapper {
		map<T>(target: any, source: T): T {
			let errorProps: string[] = helpers.getProperties(source);
			errorProps.forEach(propName => {
				target[helpers.camelize(propName)] = source[propName];
			});
			return target;
		}
	}

	export namespace helpers {
		export function getCamelizedProperties(obj: any): string[] {
			let result: string[] = getProperties(obj).map(prop =>
				camelize(prop)
			);
			return result;
		}

		export function getProperties(obj: any): string[] {
			let result: string[] = [];
			for (let property in obj) {
				if (obj.hasOwnProperty(property) && !property.startsWith("_")) {
					result.push(property);
				}
			}
			return result;
		}

		export function camelize(str: string): string {
			return str
				.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
					return index === 0
						? word.toLowerCase()
						: word.toUpperCase();
				})
				.replace(/\s+/g, "");
		}
	}
}