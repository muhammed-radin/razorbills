# Product Search API Documentation

## GET /api/products

Retrieve products with optional search and filtering capabilities.

### Query Parameters

| Parameter | Type | Description | Example | Validation |
|-----------|------|-------------|---------|------------|
| `search` | string | Text search across title, description, brand, and category | `?search=wireless` | Special regex characters are escaped |
| `category` | string | Filter by category (case-insensitive) | `?category=Electronics` | Special regex characters are escaped |
| `brand` | string | Filter by brand (case-insensitive) | `?brand=SoundMagic` | Special regex characters are escaped |
| `minPrice` | number | Minimum price filter | `?minPrice=50` | Must be a valid positive number |
| `maxPrice` | number | Maximum price filter | `?maxPrice=100` | Must be a valid positive number |
| `tags` | string | Comma-separated list of tags | `?tags=audio,wireless` | - |
| `keywords` | string | Comma-separated list of keywords | `?keywords=bluetooth headphones,wireless` | - |
| `sortBy` | string | Field to sort by (see allowed fields below) | `?sortBy=price` | Must be one of the allowed fields |
| `order` | string | Sort order: `asc` or `desc` | `?order=desc` | - |
| `page` | number | Page number for pagination (default: 1) | `?page=2` | Must be >= 1 |
| `limit` | number | Number of items per page (default: 10, max: 100) | `?limit=20` | Must be between 1 and 100 |

### Allowed Sort Fields
- `title`
- `price`
- `originalPrice`
- `category`
- `brand`
- `rating`
- `stock`
- `createdAt`
- `updatedAt`

### Response Format

```json
{
  "products": [
    {
      "id": "1",
      "title": "Wireless Headphones",
      "price": 99.99,
      "originalPrice": 149.99,
      "thumbnail": "/products/Headphone.jpg",
      "description": "High-quality wireless headphones...",
      "category": "Electronics",
      "brand": "SoundMagic",
      "tags": ["audio", "wireless", "headphones"],
      "keywords": ["wireless headphones", "bluetooth headphones"],
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Example Requests

1. **Get all products (first page)**
   ```
   GET /api/products
   ```

2. **Search for "headphones"**
   ```
   GET /api/products?search=headphones
   ```

3. **Filter by category and brand**
   ```
   GET /api/products?category=Electronics&brand=SoundMagic
   ```

4. **Price range filter**
   ```
   GET /api/products?minPrice=50&maxPrice=150
   ```

5. **Search with tags**
   ```
   GET /api/products?tags=audio,wireless
   ```

6. **Sort by price (ascending)**
   ```
   GET /api/products?sortBy=price&order=asc
   ```

7. **Combined search with pagination**
   ```
   GET /api/products?search=bluetooth&minPrice=50&maxPrice=200&page=1&limit=10&sortBy=price&order=asc
   ```

### Error Responses

**400 Bad Request - Invalid Parameters**
```json
{
  "error": "Invalid minPrice parameter"
}
```
```json
{
  "error": "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100"
}
```
```json
{
  "error": "Invalid sortBy parameter. Allowed fields: title, price, originalPrice, category, brand, rating, stock, createdAt, updatedAt"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to fetch products"
}
```

## Notes

- All text searches are case-insensitive
- Special regex characters in search terms are escaped for security
- Multiple filters can be combined
- Default pagination: page 1, limit 10 items (max limit: 100)
- Default sorting: by creation date (newest first)
- Price parameters must be valid positive numbers
- Sort field must be from the allowed list
- Pagination parameters are validated (page >= 1, 1 <= limit <= 100)
