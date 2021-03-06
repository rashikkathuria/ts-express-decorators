import {expect} from "chai";
import {CyclicReferenceError} from "../../../../packages/common/src/mvc/errors/CyclicReferenceError";

describe("CyclicReferenceError", () => {
  before(() => {
    this.errorInstance = new CyclicReferenceError(class Target {}, class Target2 {});
  });

  after(() => {
    delete this.errorInstance;
  });

  it("should have a message", () => {
    expect(this.errorInstance.message).to.equal("Cyclic reference between Target and Target2.");
  });

  it("should have a name", () => {
    expect(this.errorInstance.name).to.equal("CYCLIC_REFERENCE_ERROR");
  });
});
