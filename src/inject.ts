export default class Inject {
    // Class attributes
    // - Modules
    // - Functions
    // - Constructors
    // - Cache
    moduleId
    moduleArray = []
    constructorArray = []
    moduleObject = {}
    moduleGet = null
    args
    constructor() {
        this.moduleId = Math.random().toString(36).substring(7);
        this.args = [
            [
                [0], [(e, t, i) => {
                    const moduleCache = i.c;
                    Object.keys(moduleCache).forEach((module) => {
                        this.moduleObject[module] = moduleCache[module].exports
                    })
                    this.constructorArray = i.c
                    this.moduleGet = i;
                }]
            ],
            [
                [1e3], {
                    [this.moduleId]: (e, t, i) => {
                        const moduleCache = i.c;
                        Object.keys(moduleCache).forEach((module) => {
                            this.moduleObject[module] = moduleCache[module].exports
                        })
                        this.constructorArray = i.c
                        this.moduleGet = i;
                    }
                }, [[this.moduleId]]
            ]
        ]
        this.injectIntoWebpack();
    }
    //Call the function
    log(message) {
        console.warn(`[Failed] ${message}`);
    }
    //Inject Arguments

    injectIntoWebpack = () => {
        if (typeof window['webpackJsonp'] == 'function') {
            this.args.forEach((argument, index) => {
                try {
                    window['webpackJsonp'](...argument)
                }
                catch (err) {
                    this.log(`Inject.args[${index}] failed: ${err}`)
                }
            })
        } else {
            try {                
                window['webpackJsonp'].push(this.args[1])
            }
            catch (err) {
                this.log(`Pushing Inject.args[1] into webpackJsonp failed: ${err}`)
            }
        }
    }
   

    // Find Module
    findModule(query: any) {
        const results = [];
        const modules = Object.keys(this.moduleObject);

        modules.forEach(modKey => {
            const mod = this.moduleObject[modKey];
            if (typeof mod !== "undefined") {
                if (typeof query === "string") {
                    if (typeof mod.default === "object") {
                        for (const key in mod.default) {
                            if (key == query) {
                                results.push(mod);
                            }
                        }
                    }
                    for (const key in mod) {
                        if (key == query) results.push(mod);
                    }
                } else if (typeof query === 'function') {
                    if (query(mod)) {
                        results.push(mod);
                    }
                } else {
                    throw new TypeError(`findModule can only find via string and function, ${typeof query} was passed`);
                }
            }
        });
        return results
    }
    // Find Funtions

    findFunction(query) {
        if (this.constructorArray.length == 0) {
            throw Error('No module constructors to search through!');
        }

        const results = [];

        if (typeof query === 'string') {
            this.constructorArray.forEach((cName, index) => {
                if (cName.toString.includes(query)) {
                    results.push(this.moduleObject[index])
                }
            })
        } else if (typeof query === 'function') {
            const modules = Object.keys(this.moduleObject);

            modules.forEach((mkey, index) => {
                const mod = this.moduleObject[mkey];

                if (query(mod)) {
                    results.push(this.moduleObject[index]);
                }
            })

        } else {
            throw new TypeError(`findFunction can only find via string and function, ${typeof query} was passed`);
        }
        return results
    }

    getAllStates() {
        return {
            modules:this.moduleObject,
            constructors: this.constructorArray,
        }
    }
    // Structure
    // {
    //     _webpack_module_:(mGet)
    //             {
    //                 c:(mCac)
    //                     [id]:exports(mObj)
    //                          default = [name of module]

    //                  m:(cArr)
    //                      ["func1","func2"..]
    //                      
    //             }    
    // }

}
