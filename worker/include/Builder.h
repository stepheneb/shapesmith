#ifndef SS_BUILDER
#define SS_BUILDER

#include <json_spirit.h>
#include "OCC.h"

using namespace std;
using namespace json_spirit;

class Builder {
public:
    Builder() {};
    virtual ~Builder() {};
    
protected:
    TopoDS_Shape shape_;
    
    void ApplyOrigin(map< string, mValue > json);
    void ApplyTransform(map< string, mValue > json);
    void ApplyTransforms(map< string, mValue > json);
    virtual void PostProcess(map< string, mValue > json) = 0;
    
    
    
public:
    TopoDS_Shape shape();
    
};

#pragma mark 3D primitives

class Builder3D : public Builder {
private:
    void Mesh();
protected:
    virtual void PostProcess(map< string, mValue > json);
    virtual ~Builder3D() {};
public:
    Builder3D() {};
    
};

class CuboidBuilder : public Builder3D {

public:
    CuboidBuilder(map< string, mValue > json);
    virtual ~CuboidBuilder() {};
};

class SphereBuilder : public Builder3D {
public:
    SphereBuilder(map< string, mValue > json);
    virtual ~SphereBuilder() {};
};

class CylinderBuilder : public Builder3D {
public:
    CylinderBuilder(map< string, mValue > json);
    virtual ~CylinderBuilder() {};
};

class ConeBuilder : public Builder3D {
public:
    ConeBuilder(map< string, mValue > json);
    virtual ~ConeBuilder() {};
};

class WedgeBuilder : public Builder3D {
public:
    WedgeBuilder(map< string, mValue > json);
    virtual ~WedgeBuilder() {};
};

class TorusBuilder : public Builder3D {
public:
    TorusBuilder(map< string, mValue > json);
    virtual ~TorusBuilder() {};
};

#pragma mark 2D Primitives

class Builder2D : public Builder {
private:
    void Mesh();
protected:
    virtual void PostProcess(map< string, mValue > json);
    virtual ~Builder2D() {};
};

class Ellipse2DBuilder : public Builder2D {
public:
    Ellipse2DBuilder(map< string, mValue > json);
    virtual ~Ellipse2DBuilder() {};
};

class Rectangle2DBuilder : public Builder2D {
public:
    Rectangle2DBuilder(map< string, mValue > json);
    virtual ~Rectangle2DBuilder() {};
};

#pragma mark 1D Primitives

class Builder1D : public Builder {
protected:
    virtual void PostProcess(map< string, mValue > json);
    virtual ~Builder1D() {};
};

class Ellipse1DBuilder : public Builder1D {
public:
    Ellipse1DBuilder(map< string, mValue > json);
    virtual ~Ellipse1DBuilder() {};
};

#pragma mark Booleans

class BuilderND : public Builder {
private:
    void Mesh();
protected:
    virtual void PostProcess(map< string, mValue > json);
public:
    BuilderND() {};
    virtual ~BuilderND() {};
};

typedef TopoDS_Shape (*boolean_op)(const TopoDS_Shape&, const TopoDS_Shape&);

class BooleanBuilder : public BuilderND {
public:
    BooleanBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes, boolean_op fn);
};

class UnionBuilder : public BooleanBuilder {
public:
    UnionBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    virtual ~UnionBuilder() {};
};

class SubtractBuilder : public BooleanBuilder {
public:
    SubtractBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    virtual ~SubtractBuilder() {};
};

class IntersectBuilder : public BooleanBuilder {
public:
    IntersectBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    virtual ~IntersectBuilder() {};
};

#pragma mark Modifiers

class PrismBuilder : public BuilderND {
public:
    PrismBuilder(map< string, mValue > json, TopoDS_Shape shape);
    ~PrismBuilder() {};
};

#endif
