# Filters

Filters feature lets you create a custom decorators that will be 
used on the methods parameters like [@BodyParams](/api/common/filters/decorators/BodyParams.md)
or [@Locals](/api/common/filters/decorators/Locals.md).

### Example

This example show you, how you can implement a filter and decorator to use these, on a method Controller.
In this case, we need to retrieve the body content from an Express.Request.

So to do that, you must create a class and annotate it with the [@Filter](/api/common/filters/decorators/Filter.md)
decorator and in option, implement the [IFilter](/api/common/filters/interfaces/IFilter.md) interface:

```typescript
import {Filter, IFilter, ParseService} from "@tsed/common";

@Filter()
export class BodyParamsFilter implements IFilter {

    constructor(private parseService: ParseService) {
    }

    transform(expression: string, request, response) {
        return this.parseService.eval(expression, request["body"]);
    }
}
```

Then create the decorator. This decorator will be used on a controller method.

```typescript
import {ParamRegistry} from "@tsed/common";
import {BodyParamsFilter} from "../filters"

export function BodyParams(expression?: string | any, useType?: any): Function {
    return ParamRegistry.decorate(BodyParamsFilter, {expression, useType});
}
```

> To link the decorator with BodyParamsFilter, you must used the [ParamRegistry](/api/common/filters/registries/ParamRegistry.md) API.

### Test

#### Filter

```typescript
import {FilterService} from "@tsed/common";
import {inject} from "@tsed/testing";
import {expect} from "chai";
import {BodyParamsFilter} from "../../filters";


describe("BodyParamsFilter", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
        this.bodyParamsFilter = filterService.invoke<BodyParamsFilter>(BodyParamsFilter);
    }));

    describe("transform()", () => {
        before(() => {
            this.result = this.bodyParamsFilter.transform("test", {body: {test: "test"}});
        });

        it("should transform expression", () => {
            expect(this.result).to.equal("test");
        });
    });
});
```

#### Decorator

```typescript
import {ParamRegistry} from "@tsed/common";
import * as Chai from "chai";
import * as Sinon from "sinon";
Chai.should();

class Test {

}

describe("BodyParams", () => {

    before(() => {
        this.decorateStub = Sinon.stub(ParamRegistry, "decorate");
        BodyParams("test", Test);
    });

    after(() => {
        this.decorateStub.restore();
    });

    it("should have been called ParamFilter.decorate method with the correct parameters", () =>
        this.decorateStub.should.have.been.calledOnce
            .and
            .calledWithExactly(BodyParamsFilter, {
                expression: "test",
                useType: Test
            })
    );
});
```

## Built-in filters

See in [Built-in filters](/api/index.md?query=keywords_Filter|type_class) in our API references.
