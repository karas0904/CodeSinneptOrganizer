from backend.models.description_generator import generate_description


# Testing the description generator
if __name__ == "__main__":
    code_snippet = """
    def add_numbers(a, b):
        # Function to add two numbers
        return a + b
    """
    
    # Call the generate_description function
    description = generate_description(code_snippet)
    
    # Print the generated description
    print(f"Generated Description: {description}")
