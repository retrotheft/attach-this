import type { StandardSchemaV1 } from '@standard-schema/spec'

export function validate<TSchema extends StandardSchemaV1>(
   schema: TSchema
) {
   return (data: unknown) => {
      let inputMap = new Map<string, Element>()

      return (formElement: HTMLFormElement) => {
         // Validate the data using the schema
         const result = schema['~standard'].validate(data)

         // Handle async validation
         if (result instanceof Promise) {
            throw new TypeError('Schema validation must be synchronous')
         }

         // Extract issues from the result
         const issues = result.issues ?? []

         // Build input map on first run
         if (inputMap.size === 0) {
            const inputs = formElement.querySelectorAll('input[name]')
            for (const input of inputs) {
               const name = input.getAttribute('name')
               if (name) inputMap.set(name, input)
            }
         }

         // Clear all previous errors
         for (const input of inputMap.values()) {
            input.parentElement?.removeAttribute('data-error')
         }

         // Set form validity
         const valid = issues.length === 0 ? 'true' : 'false'
         formElement.setAttribute('data-valid', valid)

         // Apply error messages to fields
         issues.forEach(issue => {
            // Get the path as a string
            const pathKey = issue.path?.[0]
            if (pathKey !== undefined) {
               const key = typeof pathKey === 'object' && 'key' in pathKey
                  ? String(pathKey.key)
                  : String(pathKey)
               const input = inputMap.get(key)
               if (input) {
                  input.parentElement?.setAttribute('data-error', issue.message)
               }
            }
         })
      }
   }
}
