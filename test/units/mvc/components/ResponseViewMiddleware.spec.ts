import {ResponseViewMiddleware} from "../../../../packages/common/src/mvc/components/ResponseViewMiddleware";
import {inject} from "../../../../packages/testing/src";
import {expect, Sinon} from "../../../tools";

describe("ResponseViewMiddleware :", () => {
  before(
    inject([ResponseViewMiddleware], (middleware: ResponseViewMiddleware) => {
      this.response = {
        status: () => {},
        render: Sinon.stub()
      };

      this.endpoint = {
        store: {
          get: (type: any) => {
            return type === ResponseViewMiddleware
              ? {
                  viewPath: "page.html",
                  viewOptions: {test: "test"}
                }
              : {test: "test"};
          }
        }
      };

      this.middleware = middleware;
    })
  );

  describe("when header isn't sent", () => {
    before(() => {
      this.middleware.use({}, this.endpoint, this.response as any);
    });
    after(() => {
      this.response.render.reset();
    });
    it("should have middleware", () => {
      expect(this.middleware).not.to.be.undefined;
    });

    it("should set header to the response object", () => {
      this.response.render.should.be.calledWithExactly("page.html", {test: "test"}, Sinon.match.func);
    });
  });

  describe("when header isn't sent but view path is wrong", () => {
    before(() => {
      this.middleware.use(
        {},
        {
          store: {
            get: (type: any) => {
              return type === ResponseViewMiddleware
                ? {
                    viewOptions: {test: "test"}
                  }
                : {test: "test"};
            }
          }
        },
        this.response as any
      );
    });
    after(() => {
      this.response.render.reset();
    });
    it("should have middleware", () => {
      expect(this.middleware).not.to.be.undefined;
    });

    it("should set header to the response object", () => {
      this.response.render.should.not.be.called;
    });
  });
});
